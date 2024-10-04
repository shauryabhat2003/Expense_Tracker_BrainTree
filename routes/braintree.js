const express = require('express');
const router = express.Router();
const braintree = require('braintree');
const { protect } = require('../middleware/auth');

// Check for missing environment variables
if (!process.env.BRAINTREE_MERCHANT_ID || !process.env.BRAINTREE_PUBLIC_KEY || !process.env.BRAINTREE_PRIVATE_KEY) {
  console.error('Braintree environment variables are missing');
}

// Initialize Braintree Gateway
const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox, 
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY
});

// Generate client token
router.get('/token', protect, async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({
      customerId: req.user.id,
    });
    res.json({ token: response.clientToken });
  } catch (error) {
    console.error('Error generating client token:', error);
    res.status(500).json({ message: 'Error generating client token' });
  }
});

// Process payment
router.post('/checkout', protect, async (req, res) => {
  const { nonce, amount, description } = req.body;

  if (!nonce || !amount || !description) {
    return res.status(400).json({ message: 'Please provide nonce, amount, and description' });
  }

  try {
    const saleRequest = {
      amount: amount.toFixed(2),
      paymentMethodNonce: nonce,
      customerId: req.user.id,
      options: {
        submitForSettlement: true,
      },
      orderId: `EXPENSE-${Date.now()}`,
      description: description,
    };

    const result = await gateway.transaction.sale(saleRequest);

    if (result.success) {
      res.json({ success: true, transaction: result.transaction });
    } else {
      res.status(500).json({ success: false, error: result.message });
    }
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ success: false, message: 'Payment processing failed' });
  }
});

module.exports = router;