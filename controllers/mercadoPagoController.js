const { MercadoPagoConfig, Payment } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: process.env.PRIVATE_MERCADO_PAGO_ACCESS_TOKEN_TEST});
const Order = require('../models/order')
const OrderHasProducts = require('../models/order_has_products')
const { v4: uuidv4 } = require('uuid');

module.exports = {
    async createPayment(req, res) {
        const paymentClient = new Payment(client)
        console.log("Empezamos", req.body);
        const UUID = uuidv4(); 
        const payment = req.body;
        console.log("Datos del pago:", payment);

        const payment_data = {
            transaction_amount: payment.transaction_amount,
            token: payment.token,
            installments: payment.installments,
            payment_method_id: payment.payment_method_id,
            issuer_id: payment.issuer_id,
            payer: {
                email: "jesusnuez021@gmail.com",
            }
        };

        const requestOptions = {
            idempotencyKey: UUID
        };

        console.log("dataFinal",payment_data)
        paymentClient.create( {body:payment_data} ).then((response)=>{
            console.log("Resultado del pago:", response);
            const order = payment.order;
            Order.create(order, async (err, id) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro de la orden',
                        error: err
                    });
                }

                for (const product of order.products) {
                    const orderHasProducts = {
                        id_order: id,
                        id_product: product.id,
                        quantity: product.quantity
                    };
                    await OrderHasProducts.create(orderHasProducts, (err, id_data) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error con el registro del order_has_orden',
                                error: err
                            });
                        }
                    });
                }

                return res.status(201).json({
                    success: true,
                    message: 'Orden se creó con éxito',
                    data: response
                });
            });
        }).catch((err)=>{
            console.error("Error en Mercado Pago:", err);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con Mercado Pago',
                error: err
            });
        });            
    }
};
