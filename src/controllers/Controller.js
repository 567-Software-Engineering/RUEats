const response = require('./../utils/response');
const RUEatsRepository = require('./../db/RUEatsRepository');
const dbRepo = new RUEatsRepository();


const getUserOrder = async (req, res) =>{

    try{
        const{orderID, userID } = req.params;
        const order = await dbRepo.getOrderByOrderIDUserID(orderID, userID);
        const data = order ? order : `Order not found for OrderID: ${orderID}, UserID: ${userID}`;
        response(res,{data});
    }
    catch(error){
        response(res,{status : 400, data : error.message});
    }
};

module.exports = {
    getUserOrder
};