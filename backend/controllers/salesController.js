const { query, getClient } = require('../config/db');
const { asyncHandler, ApiError } = require('../middleware/errorHandler');

const PAYMENT_METHODS = ['CASH', 'UPI', 'CARD'];

/**
 * POST /api/sales (owner only) — completes a POS bill.
 * body: { items: [{ product_id, quantity }], payment_method }
 * Deducts inventory immediately (a POS sale is instantaneous, unlike a customer order).
 */
const createSale = asyncHandler(async (req, res) => {
  const { items, payment_method } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, 'Sale must contain at least one item.');
  }
  if (!PAYMENT_METHODS.includes(payment_method)) {
    throw new ApiError(400, `payment_method must be one of: ${PAYMENT_METHODS.join(', ')}`);
  }

  const client = await getClient();
  try {
    await client.query('BEGIN');

    const receiptNo = `RCPT-${Date.now()}`;
    const saleRecords = [];
    let grandTotal = 0;

    for (const { product_id, quantity } of items) {
      if (!product_id || !Number.isInteger(quantity) || quantity <= 0) {
        throw new ApiError(400, 'Each item needs a valid product_id and a positive integer quantity.');
      }

      const productResult = await client.query('SELECT * FROM products WHERE id = $1', [product_id]);
      if (productResult.rows.length === 0) throw new ApiError(404, `Product ${product_id} not found.`);
      const product = productResult.rows[0];

      const invResult = await client.query('SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE', [product_id]);
      const inv = invResult.rows[0];
      if (!inv || inv.quantity < quantity) {
        throw new ApiError(400, `Insufficient stock for "${product.name}". Available: ${inv ? inv.quantity : 0}.`);
      }

      const lineTotal = Number(product.price) * quantity;
      grandTotal += lineTotal;

      await client.query(
        'UPDATE inventory SET quantity = quantity - $1, updated_at = NOW() WHERE product_id = $2',
        [quantity, product_id]
      );
      await client.query(
        `INSERT INTO stock_movements (product_id, quantity_change, movement_type, reference)
         VALUES ($1, $2, 'SALE', $3)`,
        [product_id, -quantity, receiptNo]
      );

      const saleResult = await client.query(
        `INSERT INTO sales (product_id, quantity, total_amount, payment_method, receipt_no)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [product_id, quantity, lineTotal.toFixed(2), payment_method, receiptNo]
      );
      saleRecords.push({ ...saleResult.rows[0], product_name: product.name });
    }

    await client.query('COMMIT');

    res.status(201).json({
      receipt: {
        receipt_no: receiptNo,
        items: saleRecords,
        grand_total: grandTotal.toFixed(2),
        payment_method,
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

/**
 * GET /api/sales (owner only) — recent sales, optional ?limit=
 */
const listSales = asyncHandler(async (req, res) => {
  const { limit = 100 } = req.query;
  const result = await query(
    `SELECT s.*, p.name AS product_name
     FROM sales s JOIN products p ON p.id = s.product_id
     ORDER BY s.created_at DESC LIMIT $1`,
    [limit]
  );
  res.json({ sales: result.rows });
});

module.exports = { createSale, listSales };
