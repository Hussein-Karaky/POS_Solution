using BLL.Payment;
using BLL.Shared;
using DAL.Payment;
using INTO.Controllers.Shared;
using INTO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Collections.Generic;

namespace INTO.Controllers
{
    public class PaymentController : SecureController<PaymentController>
    {
        //Lookup Details Id : OperationType PaymentServices PaymentMethods//
        //private readonly IDictionary<string, int> LkpDetails = new Dictionary<string, int> (){ 
        //    {"CASH", 100628},{"CARD", 100629},{"MTRANSFER", 100630},{"PAY", 100571},{"REV", 100570},{"CAPTURE",100662},{"VOID",100663},
        //    {"REF", 100572},{"FEES", 100573},{"F2F", 100574},{"ONLINE", 100575},{"CLASS", 100576}
        //}; 

        //Serials ID
        //private readonly IDictionary<string, int> Serials = new Dictionary<string, int>(){
        //    {"PC", 1},{"PB", 2},{"PT", 3},{"PP", 4},{"RV", 5},{"RF", 6},{"VD", 7},{"FC", 8},{"FP", 9},{"FT", 10},{"FI", 11}
        //};

        //Get percentage for tutor rate and Payment Services Fees
        private readonly IDictionary<string, string> Perc = new Dictionary<string, string>();
        //Lookup Details Id : OperationType PaymentServices PaymentMethods//
        private readonly IDictionary<string, int> LkpDetails = new Dictionary<string, int>();
        //Serials ID
        private readonly IDictionary<string, int> Serials = new Dictionary<string, int>();

        public PaymentController(IConfiguration configuration) : base(configuration) {
            Perc = PaymentDB.GetAppSettings(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            LkpDetails = PaymentDB.GetLPymtkpDetails(1,GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            Serials = PaymentDB.GetSerials(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
        }

        public IActionResult Index()
        {
            if(TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract(),
                };
                paymentModel.hasHasBlInfo = PaymentDB.HasBillingInfo(paymentModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                paymentModel.PaidSessions = PaymentDB.GetPaidSessions(paymentModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));            
                Console.WriteLine("Date         Name            Operation     Amount     Captured?");
                TempData.Keep("TutorModel");
                return View(paymentModel);
            }
            return View(new PaymentModel());
        }
               
        //Open Payment Wizard by getting session info as json
        [HttpPost]
        public IActionResult PayNow(string json)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                paymentModel.session = new Session(json);
                paymentModel.wallet = PaymentDB.GetWallet(paymentModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (paymentModel.session.HasBlInfo)
                    paymentModel.billingInfo = PaymentDB.GetBillingInfo(userCache.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                else paymentModel.billingInfo = null;
                TempData.Keep("TutorModel");
                return PartialView(paymentModel);
            }
            return PartialView(new PaymentModel());
        }

        //Open Payment Wizard by getting session Id only
        [HttpPost]
        public IActionResult PayNow1(int SessionId)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                paymentModel.session = PaymentDB.GetSessionDetails(SessionId, paymentModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                paymentModel.wallet = PaymentDB.GetWallet(paymentModel.User.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                paymentModel.billingInfo = PaymentDB.GetBillingInfo(userCache.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                TempData.Keep("TutorModel");
                return PartialView(paymentModel);
            }
            return PartialView(new PaymentModel());
        }

        //Manage User Operations : Show Opr + Filter

        [Route("Payment/Operations/{SessionId?}", Order = 1)]
        public IActionResult Operations(int SessionId = 0)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                paymentModel.SessionId = SessionId;
                TempData.Keep("TutorModel");
                return View(paymentModel);
            }
            return View(new PaymentModel());
        }

        //Get Oprations as json array for Js Tabulator Library
        public IActionResult GetJsonOpr()
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                paymentModel.Operations = PaymentDB.GetOprList(userCache.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                TempData.Keep("TutorModel");
                return Json(paymentModel.Operations);
            }
            return null;
        }

        //Administrator Page : Manage session Operations : 
        [Route("Payment/ViewAllOperations/", Order = 1)]
        public IActionResult ViewAllOperations(int SessionId = 0)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                TempData.Keep("TutorModel");
                return View(paymentModel);
            }
            return View(new PaymentModel());
        }
        [Route("Payment/GetAllJsonOpr/", Order = 1)]
        //Get Sessions as json array for Js Tabulator Library
        public IActionResult GetAllJsonOpr()
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract()
                };
                paymentModel.Operations = PaymentDB.GetAllOperations(GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                TempData.Keep("TutorModel");
                return Json(paymentModel.Operations);
            }
            return null;
        }


        //Print Payment Invoice

        [Route("Payment/Invoice/{OprId}", Order = 1)]
        public IActionResult Invoice(int OprId)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract(),
                    operation = PaymentDB.GetOprDetails(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION))
                }; 
                TempData.Keep("TutorModel");
                return PartialView(paymentModel);
            }
            return PartialView(new PaymentModel());

        }

        [Route("Payment/IsPaid/{ObjName}/{ObjId}/{UserId}", Order = 1)]
        //Check if event is paid or no
        // Example : Payment/IsPaid/Event/117/40100
        public int IsPaid(string ObjName, int ObjId,int UserId)
        {
            int response = PaymentDB.IsPaid(ObjName,ObjId, UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return response;
        }

        [Route("Payment/SuccessfullySession/{SessionId}", Order = 1)]
        //Capture money if session end successfully
        public int SuccessfullySession(int SessionId)
        {
            int response = PaymentDB.CapturePayments(SessionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return 1;
        }

        [Route("Payment/UnSuccessfullySessions/{SessionId}", Order = 1)]
        //Return money if session end Unsuccessfully
        public int UnSuccessfullySession(int SessionId)
        {
            IList<Operation> operations = PaymentDB.GetAllSessionOperations(SessionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            foreach (Operation op in operations)
            {
                //If the payment was made via the card so refund it
                if (op.PaymentMethodId == LkpDetails["Card"])
                    if(op.Captured==1) ApiRefundPayment(op.Id);
                else  ApiVoidPayment(op.Id);

                //If the payment was made via OMT we need to refund it

                //If the payment was made via Paypal we need to refund it

            }
            int response = PaymentDB.ReturnPayments(SessionId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            return response;
        }

        [Route("Payment/OprDetails/{OprId}", Order = 1)]
        //Open Opr Details : Show Opr details and Refund if possible
        public IActionResult OprDetails(int OprId)
        {
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                PaymentModel paymentModel = new PaymentModel
                {
                    User = userCache.Extract(),
                    operation = PaymentDB.GetOprDetails(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION))
                };
                if (paymentModel.operation == null) return PartialView(new PaymentModel());
                Console.WriteLine(paymentModel.operation.Auto);
                Console.WriteLine(paymentModel.operation.PaymentMethodId);
                Console.WriteLine(DateTime.Compare(DateTime.Now, paymentModel.operation.CancelationDate) < 0);
                Console.WriteLine(paymentModel.operation.Captured);
                //if payment is not returned before   &&   not auto payment   &&   made by card    && before cancelation Date   -> THEN CAN BE REFUND
                if (paymentModel.operation.Canceled == 0 &&  paymentModel.operation.Auto==0 && paymentModel.operation.PaymentMethodId == LkpDetails["Card"] && DateTime.Compare(DateTime.Now, paymentModel.operation.CancelationDate) < 0)
                {
                    //refund if opr is captured 
                    if (paymentModel.operation.Captured == 1)
                    {
                        paymentModel.operation.Action = "RefundPayment";
                        paymentModel.operation.CanRefund = true;
                    }
                    //Void if opr is not captured yet
                    else
                    {
                        paymentModel.operation.Action = "VoidPayment";
                        paymentModel.operation.CanVoid = true;
                    }
                }
                else if(paymentModel.operation.Canceled == 1) paymentModel.operation.Action = "Canceled";
                else
                    paymentModel.operation.Action = "NoAction";

                TempData.Keep("TutorModel");
                return PartialView(paymentModel);
            }
            return PartialView(new PaymentModel());
        }       

        //Cash payment
        [HttpPost]
        public int CashPayment(string json)
        {
            Session session = new Session(json);
            if (session.AutoCapture) { session.CaptureOn = DateTime.Now; }
            int Response = 0;
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                Operation Op = new Operation {
                    UID = userCache.UserId,
                    RelationId = session.Id,
                    RelationEntity = "Event",
                    Amount = session.Amount,
                    Currency = session.Currency,
                    CaptureOn = getCaptureDate(LkpDetails["Cash"], session.DateStamp, session.CancelationDate),
                    Captured= 0,
                    RespDate = DateTime.Now,
                    Auto = 0,
                    Description = session.Title,
                    OprTypeId = LkpDetails["Payment"],
                    PaymentMethodId = LkpDetails["Cash"],                    
                    SerialId = Serials["PC"],
                    ObjEntityId = 1,
                    CancelationDate = session.CancelationDate,
                    TutorId = session.TutorId,
                    TutorName = session.TutorName,
                    billingInfo = new BillingInfo()
                };
                Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (Response !=0)
                {
                    Op.LinkedOprId = Response;
                    SendNotification(DateTime.Now, userCache.FirstName, "Cash Pymt", session.Amount, Op.Captured);
                    //Operation 2 : Subtract tutor Fees     
                    decimal fee = 1 - Convert.ToDecimal(Perc["TutorPercentage"]);
                    SubtractTutorFees(Op, session.TutorId, session.TutorName, fee);
                    TempData.Keep("TutorModel");
                    return Response;
                }
                return 0;
            }
        return Response;
        }
        
        //OMT Payment
        [HttpPost]
        public int MTransferPayment(string json)
        {
            Session session = new Session(json);
            if (session.AutoCapture) { session.CaptureOn = DateTime.Now; }
            int Response = 0;
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);
                Operation Op = new Operation {
                    UID = userCache.UserId,
                    RelationId = session.Id,
                    RelationEntity = "Event",
                    Amount = session.Amount,
                    Currency = session.Currency,
                    CaptureOn = getCaptureDate(LkpDetails["MoneyTransfer"], session.DateStamp, session.CancelationDate),
                    Captured = 0,
                    RespDate = DateTime.Now,
                    Auto = 0,
                    Description = session.Title,
                    OprTypeId = LkpDetails["Payment"],
                    PaymentMethodId = LkpDetails["MoneyTransfer"],
                    SerialId = Serials["PT"],
                    ObjEntityId = 1,
                    RespAttch = session.Photo,
                    CancelationDate = session.CancelationDate,
                    TutorId = session.TutorId,
                    TutorName = session.TutorName,
                    billingInfo = new BillingInfo()
                };
                Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (Response != 0)
                {
                    Op.LinkedOprId = Response;
                    SendNotification(DateTime.Now, Learner, "OMT Pymt", session.Amount, Op.Captured);
                    //Operation 2 : Add tutor Revenue

                    decimal revenue = Convert.ToDecimal(Perc["TutorPercentage"]);
                    AddTutorRevenue(Op, session.TutorId, session.TutorName, revenue);
                    //Operation 3 : Subtract OMT Fees

                    decimal fee = Convert.ToDecimal(Perc["OmtFees"]);
                    decimal Per = Convert.ToDecimal(Perc["OmtPercentage"]);
                    SubtractFees(Op, "OMT Fees", fee, Per, Serials["FT"]);
                    TempData.Keep("TutorModel");
                    return Response;
                }
                return 0;
            }
            return Response;
        }

        //Card Payment
        [HttpPost]
        public int ApiRequestPayment(string json)
        {
            Session session = new Session(json);
            //if (session.AutoCapture == true) { session.CaptureOn = DateTime.Now; }
            session.CaptureOn = getCaptureDate(LkpDetails["Card"], session.DateStamp, session.CancelationDate);
            int Response = 0;
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);
                //Build API Request
                object jsonParameters = new
                {
                    source = new
                    {
                        type = "token",
                        token = session.Token
                    },
                    customer = new
                    {
                        email = userCache.Email,
                        name = Learner
                    },
                    description = session.Title,
                    amount = session.Amount * 100,
                    currency = session.Currency,
                    approved = true,
                    reference = "Session-" + session.Id,
                    capture_on = session.CaptureOn
                };
                string responseString = ApiRequest(jsonParameters, "https://api.sandbox.checkout.com/payments");
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);

                //if the API request success add operations to DB
                if (jObj != null && jObj.status == "Authorized")
                {
                    //Operation 1 : Record Learner Payment
                    Operation Op = new Operation
                    {
                        UID = userCache.UserId,
                        RelationId = session.Id,
                        RelationEntity = "Event",
                        Amount = session.Amount,
                        Currency = session.Currency,
                        RespDate = (DateTime)jObj.processed_on,
                        RespDetails = responseString.Replace("\"", string.Empty),
                        CaptureOn = getCaptureDate(LkpDetails["Card"], session.DateStamp, session.CancelationDate),
                        Auto = 0,
                        Description = session.Title,
                        ServiceId = session.Service == "F2F" ? LkpDetails["F2F"] : LkpDetails["Online"],
                        RespId = jObj.id,
                        OprTypeId = LkpDetails["Payment"],
                        PaymentMethodId = LkpDetails["Card"],
                        SerialId = Serials["PB"],
                        ObjEntityId = 1,//Nabih get user Entity id
                        CancelationDate = session.CancelationDate,
                        TutorId = session.TutorId,
                        TutorName = session.TutorName,
                        billingInfo = new BillingInfo()
                        {
                            UID = userCache.UserId,
                            ObjEntityId = 1,//Nabih get user Entity id
                            CardId = jObj.source.id,
                            CardType = jObj.source.scheme,
                            CardExpYear = jObj.source.expiry_year,
                            CardLast4dig = jObj.source.last4,
                            CardExpMnth = jObj.source.expiry_month
                        }
                    };
                    if (Op.CaptureOn != session.DateStamp) { Op.Captured = 1; }
                    Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    if (Response != 0)
                    {
                        Op.LinkedOprId = Response;
                        SendNotification(DateTime.Now, Learner, "Card Pymt", session.Amount,Op.Captured);

                        //Operation 2 : Add tutor Revenue
                        decimal revenue = Convert.ToDecimal(Perc["TutorPercentage"]);
                        AddTutorRevenue(Op, session.TutorId, session.TutorName, revenue);
                        //Operation 3 : Subtract Checkout Fees
                        decimal fee = Convert.ToDecimal(Perc["CheckoutFees"]);
                        decimal Per = Convert.ToDecimal(Perc["CheckoutPercentage"]);
                        SubtractFees(Op, "Checkout Fees", fee, Per, Serials["FC"]);
                    }
                    TempData.Keep("TutorModel");
                    return Response;
                }
                else
                {
                    if (jObj.response_code == 20087) Response = -1;// Invalid card cvv or exp date
                }
            }
            return Response;
        }

        //using saved card details 
        [HttpPost]
        public int ApiCardDetails(string json)
        {
            Session session = new Session(json);
            session.CaptureOn = getCaptureDate(LkpDetails["Card"], session.DateStamp, session.CancelationDate);
            int Response = 0;
            if (TempData["TutorModel"] != null)
            {
                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);
                BillingInfo bl = PaymentDB.GetBillingInfo(userCache.UserId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                //Build API Request
                object jsonParameters = new
                {
                    source = new
                    {
                        type = "id",
                        id = bl.CardId
                    },
                    amount = session.Amount*100,
                    reference = "Session-" + session.Id,
                    currency = session.Currency,
                    capture_on = session.CaptureOn
                };
                Console.WriteLine(jsonParameters);
                var requestUrl = "https://api.sandbox.checkout.com/payments/";
                string responseString = ApiRequest(jsonParameters, requestUrl);
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);
                //if the API request success add operations to DB
                if (jObj != null)
                {
                    //Operation 1 : Record Learner Payment
                    Operation Op = new Operation
                    {
                        UID = userCache.UserId,
                        RelationId = session.Id,
                        RelationEntity = "Event",
                        Amount = session.Amount,
                        Currency = session.Currency,
                        RespDate = (DateTime)jObj.processed_on,
                        RespDetails = responseString.Replace("\"", string.Empty),
                        CaptureOn = getCaptureDate(LkpDetails["Card"],session.DateStamp, session.CancelationDate),
                        Auto = 0,
                        Description = session.Title,
                        ServiceId = session.Service == "F2F" ? LkpDetails["F2F"] : LkpDetails["Online"],
                        RespId = jObj.id,
                        OprTypeId = LkpDetails["Payment"],
                        PaymentMethodId = LkpDetails["Card"],
                        SerialId = Serials["PB"],
                        ObjEntityId = 1,//Nabih get user Entity id
                        CancelationDate = session.CancelationDate,
                        TutorId = session.TutorId,
                        TutorName = session.TutorName
                    };
                    if (Op.CaptureOn != session.DateStamp) { Op.Captured = 1; }
                    Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));

                    if (Response !=0)
                    {
                        Op.LinkedOprId = Response;
                        SendNotification(DateTime.Now, Learner, "Card Pymt", session.Amount, Op.Captured);
                        //Operation 2 : Add tutor Revenue

                        decimal revenue = Convert.ToDecimal(Perc["TutorPercentage"]);
                        AddTutorRevenue(Op, session.TutorId, session.TutorName, revenue);
                        //Operation 3 : Subtract Checkout Fees
                        decimal fee = Convert.ToDecimal(Perc["CheckoutFees"]);
                        decimal Per = Convert.ToDecimal(Perc["CheckoutPercentage"]);
                        SubtractFees(Op, "Checkout Fees", fee, Per, Serials["FC"]);
                    }
                    TempData.Keep("TutorModel");
                    return Response;
                }
            }
            return Response;
        }

        //Refund payment if possible (checkout payment only)
        [HttpPost]
        public int ApiRefundPayment(long OprId = 0)
        {
            int Response = -1;
            if (TempData["TutorModel"] != null)
            {
                Operation op = PaymentDB.GetOprDetails(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                if (op.Captured == 0 || op.Auto == 1 || op.PaymentMethodId != LkpDetails["Card"] || DateTime.Compare(DateTime.Now, op.CancelationDate) > 0) return 0;

                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);

                object jsonParameters = new
                {
                    reference = "REFUND-" + op.RelationId
                };
                Console.WriteLine(op.ApiReference);
                var requestUrl = "https://api.sandbox.checkout.com/payments/" + op.ApiReference + "/refunds";
                string responseString = ApiRequest(jsonParameters, requestUrl);
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);
                if (jObj != null)
                {
                    op.RespDate = DateTime.Now;
                    op.RespDetails = responseString.Replace("\"", string.Empty);
                    op.RespId = jObj.id;
                    op.Auto = 0;
                    op.Captured = 1;
                    op.OprTypeId = LkpDetails["Refund"];
                    op.SerialId = Serials["RF"];
                    op.LinkedOprId = OprId;
                    op.UID = userCache.UserId;
                    op.ObjEntityId = 1;//Nabih get user Entity id
                    Response = PaymentDB.CancelOperation(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    Response = PaymentDB.SubmitOperation(op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    if (Response != 0)
                    {
                        op.LinkedOprId = Response;
                        SendNotification(DateTime.Now, Learner, "Refund Pymt", op.Amount, op.Captured);
                        
                        //Operation 2 : Substract tutor Revenue

                        decimal revenue = 1 - Convert.ToDecimal(Perc["TutorPercentage"]);
                        SubtractTutorFees(op, op.TutorId, op.TutorName, revenue);
                        //Operation 3 : Cancel Checkout Fees
                        decimal fee = Convert.ToDecimal(Perc["CheckoutFees"]);
                        decimal Per = Convert.ToDecimal(Perc["CheckoutPercentage"]);
                        CancelFees(op, "Refund Checkout Fees", fee, Per, Serials["FC"]);
                    }
                }
            }
            return Response;
        }
        //Capture Card payment 
        [HttpPost]
        public int ApiCapturePayment(long OprId = 0)
        {
            int Response = -1;
            if (TempData["TutorModel"] != null)
            {
                Operation op = PaymentDB.GetOprDetails(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));

                if (op.Captured==1 || op.Auto ==1 || op.PaymentMethodId != LkpDetails["Card"]) return 0;

                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);
                
                object jsonParameters = new
                {
                    reference = "CAPTURE-" + op.RelationId
                };
                Console.WriteLine(op.ApiReference);
                var requestUrl = "https://api.sandbox.checkout.com/payments/" + op.ApiReference + "/captures";
                string responseString = ApiRequest(jsonParameters, requestUrl);
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);
                if (jObj != null)
                {
                    op.RespDate = (DateTime)jObj.processed_on;
                    op.RespDetails = responseString.Replace("\"", string.Empty);
                    op.RespId = jObj.id;
                    op.Auto = 0;
                    op.Captured = 1;
                    op.OprTypeId = LkpDetails["Capture"];
                    op.SerialId = Serials["PB"];
                    op.UID = userCache.UserId;
                    op.ObjEntityId = 1;//Nabih get user Entity id

                    Response = PaymentDB.SubmitOperation(op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    if (Response != 0)
                    {
                        SendNotification(DateTime.Now, Learner, "Capture Pymt", op.Amount, op.Captured);
                    }
                }
            }
            return Response;
        }
        //cancel payment if not been captured(checkout payment only)
        [HttpPost]
        public int ApiVoidPayment(long OprId = 0)
        {
            int Response = -1;
            if (TempData["TutorModel"] != null)
            {
                Operation op = PaymentDB.GetOprDetails(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));

                if (op.Captured == 0 || op.Auto == 1 || op.PaymentMethodId != LkpDetails["Card"]) return 0;

                UserCache userCache = JsonConvert.DeserializeObject<UserCache>(TempData["TutorModel"].ToString());
                string Learner = String.Concat(userCache.FirstName, userCache.LastName);

                object jsonParameters = new
                {
                    reference = "VOID-" + op.RelationId
                };
                Console.WriteLine(op.ApiReference);
                var requestUrl = "https://api.sandbox.checkout.com/payments/" + op.ApiReference + "/captures";
                string responseString = ApiRequest(jsonParameters, requestUrl);
                dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);
                if (jObj != null)
                {
                    op.RespDate = (DateTime)jObj.processed_on;
                    op.RespDetails = responseString.Replace("\"", string.Empty);
                    op.RespId = jObj.id;
                    op.Auto = 0;
                    op.Captured = 1;
                    op.OprTypeId = LkpDetails["Void"];
                    op.SerialId = Serials["PB"];
                    op.LinkedOprId = OprId;
                    op.UID = userCache.UserId;
                    op.ObjEntityId = 1;//Nabih get user Entity id

                    Response = PaymentDB.CancelOperation(OprId, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    Response = PaymentDB.SubmitOperation(op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
                    if (Response != 0)
                    {
                        SendNotification(DateTime.Now, Learner, "Void Pymt", op.Amount, op.Captured);
                    }
                }
            }
            return Response;
        }

        //Build Api Request
        private string ApiRequest(object Parameters, string url)
        {
            HttpClient client = new HttpClient();

            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
            string SECRETKEY = GetConfiguration().GetSection("SecretKeys").GetSection("PaymentSecret").Value;
            client.DefaultRequestHeaders.Add("Authorization", SECRETKEY);//NABIH Secret Id saved to appcontroller

            var jsonRequest = JsonConvert.SerializeObject(Parameters);
            var buffer = System.Text.Encoding.UTF8.GetBytes(jsonRequest);
            var byteContent = new ByteArrayContent(buffer);
            string responseString = "";

            byteContent.Headers.ContentType = new MediaTypeHeaderValue("application/json");
            HttpResponseMessage response = client.PostAsync(url, byteContent).Result;
            Console.WriteLine(response);
            //Http Status code 200
            if (response.IsSuccessStatusCode)
            {
                ////Read response content result into string variable
                responseString = response.Content.ReadAsStringAsync().Result; Console.WriteLine(responseString);
                ////Deserialize the string to JSON object
                //dynamic jObj = (JObject)JsonConvert.DeserializeObject(responseString);
                return responseString;
            }
            return responseString;
        }

        //Decide When to capture payment
        private DateTime getCaptureDate(int OprMethodId,DateTime DueDate, DateTime CancelationDate)
        {
            //cash payment -> Capture money when session begin
            //OMT payment  -> Capture money when session begin
            //Card payment -> check Cancelation Date 
            //////////////// In case that less than 7 days remain for the cancellation date  -> Capture money when session begin
            //////////////// In case that more than 7 days left before CancelationDate  -> auto capture
            if(OprMethodId == LkpDetails["Card"] && (CancelationDate - DateTime.Now).TotalDays > 7)
            {
                return DateTime.Now;
            }
            return DueDate;
        }

        //Increase tutor Balance when operation done
        private void AddTutorRevenue(Operation Op, long TutorId, string TutorName, decimal percentage)
        {
            Op.UID = TutorId;
            Op.Amount = Op.Amount * (decimal)percentage;
            Op.Auto = 1;
            //Op.Captured = 0;
            Op.OprTypeId = LkpDetails["Revenue"];
            Op.SerialId = Serials["RV"];
            Op.LinkedOprId = Op.Id;

            int Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            SendNotification(DateTime.Now, TutorName, "Tutor Rev", Op.Amount, Op.Captured);
        }

        [Route("Payment/testAmount/{amount}", Order = 1)]
        public decimal testAmount(decimal amount=0)
        {
            decimal fee = Convert.ToDecimal(Perc["CheckoutFees"]);
            decimal Per = Convert.ToDecimal(Perc["CheckoutPercentage"]);
            decimal response = amount * (decimal)Per + (decimal)fee;
            return response;
        }

            //Decrease tutor Balance when cash operation done
            private void SubtractTutorFees(Operation Op, long TutorId, string TutorName, decimal percentage)
        {
            Op.UID = TutorId;
            Op.Amount = Op.Amount * (decimal)percentage;
            Op.Auto = 1;
            //Op.Captured = 0;
            Op.OprTypeId = LkpDetails["Fees"];
            Op.SerialId = Serials["FI"];
            Op.LinkedOprId = Op.Id;

            int Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            SendNotification(DateTime.Now, TutorName, "INTO Fees", Op.Amount, Op.Captured);
        }

        //Chekout Fees or OMT Fees
        private void SubtractFees(Operation Op, string Method, decimal Fees, decimal percentage, int serial)
        {
            Op.UID = serial == 8 ? 40108 : 40109; //Nabih chkout id
            Op.Amount = Op.Amount * (decimal)percentage + (decimal)Fees;
            Op.Auto = 1;
            //Op.Captured = 0;
            Op.OprTypeId = LkpDetails["Fees"];
            Op.SerialId = serial;
            Op.LinkedOprId = Op.Id;
            Console.WriteLine(Op);
            int Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            SendNotification(DateTime.Now, Method, "CHKT Fees", Op.Amount, Op.Captured);
        }
       
        //Cancel Chekout Fees when refund money
        private void CancelFees(Operation Op, string Method, decimal Fees, decimal percentage, int serial)
        {
            Op.UID = 40108; //Nabih chkout id
            Op.Amount = Op.Amount * (decimal)percentage + (decimal)Fees;
            Op.Auto = 1;
            Op.Captured = 0;
            Op.OprTypeId = LkpDetails["Refund"];
            Op.Canceled = 1;

            int Response = PaymentDB.SubmitOperation(Op, GetConfiguration().GetConnectionString(DEFAULT_CONNECTION));
            SendNotification(DateTime.Now, Method, "Refund CHKT Fees", Op.Amount, Op.Captured);
        }

        //Notification Message
        private void SendNotification(DateTime date, string Name = "",string OprName = "",decimal Amount = 0,int capture = 0)
        { 
            string notification = date.ToShortDateString() + "     "+ Name + "      "+ OprName  + "      " + Amount + "      " + capture;
            Console.WriteLine(notification);
        }
    }
}