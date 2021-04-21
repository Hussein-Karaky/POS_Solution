using BLL.Payment;
using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Payment
{
    public class PaymentDB
    {
        public static decimal GetWallet(long UID = 0, string connection = "")   
        {
            decimal MyWallet = 0;
            using (SqlConnection con = new SqlConnection(connection))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetWallet" });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    if (rdr.HasRows)
                    {
                        rdr.Read();
                        MyWallet = rdr["Wallet"] != DBNull.Value ? Convert.ToDecimal(rdr["Wallet"]) : (decimal)0;
                        MyWallet = Math.Round(MyWallet, 2);
                    }
                    con.Close();
                    return MyWallet;
                }
                catch (Exception ex) {
                    return 0;
                }
            }
        }   
        public static int IsPaid(string ObjName, int ObjId, int UserId, string connection = "")  
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                int resp = 0;
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "IsPaid" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UId", Value = UserId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationEntity", Value = ObjName });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = ObjId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    resp = rdr["isPaid"] != DBNull.Value ? Convert.ToInt32(rdr["isPaid"]) : 0;
                }
                con.Close();
                return resp;
            }
        }
        public static Operation GetOprDetails(long OprId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetOprDetails" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@OprId", Value = OprId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    Operation Op = new Operation
                    {
                        Id = Convert.ToInt32(rdr["Id"]),
                        UID = Convert.ToInt32(rdr["UID"]),
                        DateStamp = Convert.ToDateTime(rdr["DateStamp"]),
                        CancelationDate = Convert.ToDateTime(rdr["CancelationDate"]),
                        CaptureOn = Convert.ToDateTime(rdr["CaptureOn"]),
                        Amount = Math.Round(Convert.ToDecimal(rdr["Amount"]), 2),
                        Currency = rdr["Currency"].ToString(),
                        PaymentMethodId = Convert.ToInt32(rdr["PaymentMethodId"]),
                        ServiceId = Convert.ToInt32(rdr["ServiceId"]),
                        SerialNb = rdr["SerialNb"].ToString(),
                        Description = rdr["Description"].ToString(),
                        PaymentMethod = rdr["PaymentMethod"].ToString(),
                        BillingInfoId = Convert.ToInt32(rdr["BillingInfoId"]),
                        RelationId = Convert.ToInt32(rdr["RelationId"]),
                        Captured = Convert.ToInt32(rdr["Captured"]),
                        Auto = Convert.ToInt32(rdr["Auto"]),
                        TutorId = Convert.ToInt32(rdr["TutorId"]),
                        TutorName = rdr["TutorName"].ToString(),
                        ApiReference = rdr["ApiReference"].ToString(),
                        RespId = rdr["RespId"].ToString(),
                        Canceled = Convert.ToInt32(rdr["Canceled"])
                    };
                    return Op;
                }
                con.Close();
            }
            return null;
        }       
        public static Session GetSessionDetails(long SessionId = 0, long UId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetSessionDetails" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = SessionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    Session session = new Session
                    {
                        Id = Convert.ToInt32(rdr["Id"]),
                        UID = UId,
                        DateStamp = Convert.ToDateTime(rdr["DueDate"]),
                        Title = rdr["Title"].ToString(),
                        Amount = Convert.ToDecimal(rdr["Amount"]),
                        Currency = rdr["Currency"].ToString(),
                        //ServiceId = rdr["type"]!= null ? Convert.ToInt32(rdr["type"]) : 1,
                        ServiceId =  1,
                        TutorId = Convert.ToInt32(rdr["Host"]),
                        CancelationDate = Convert.ToDateTime(rdr["CancelationDate"]),
                        TutorName = rdr["HostName"].ToString(),
                        AutoCapture = false
                    };
                    return session;
                }
                con.Close();
            }
            return null;
        }
        public static IList<OperationView> GetOprList(long UID, string connection = "")
        {
            List<OperationView> Operations = new List<OperationView>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetUserOperations" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    OperationView operation = new OperationView();
                    operation.Id = Convert.ToInt32(rdr["Id"]);
                    operation.RelationId = Convert.ToInt32(rdr["RelationId"]);
                    DateTime d = Convert.ToDateTime(rdr["DateStamp"]);
                    operation.DateString = d.ToString("yyyy-MM-dd");
                    operation.Amount = Math.Round(Convert.ToDecimal(rdr["Amount"]),2);
                    operation.PaymentMethod = rdr["PaymentMethod"].ToString();
                    operation.Currency = rdr["Currency"].ToString();
                    operation.Description = rdr["Description"].ToString();
                    operation.TutorName = rdr["TutorName"].ToString();
                    d = Convert.ToDateTime(rdr["CaptureOn"]);
                    operation.CapDateString = d.ToString("yyyy-MM-dd");
                    Operations.Add(operation);
                }
                con.Close();
            }
            return Operations;
        }
        public static IList<OperationView> GetAllOperations( string connection = "")
        {
            List<OperationView> Operations = new List<OperationView>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetAllOperations" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    OperationView operation = new OperationView();
                    operation.Id = Convert.ToInt32(rdr["Id"]);
                    operation.Description = rdr["Description"].ToString();
                    DateTime d = Convert.ToDateTime(rdr["DateStamp"]);
                    operation.DateString = d.ToString("yyyy-MM-dd");
                    operation.Amount = Convert.ToDecimal(rdr["Amount"]);
                    operation.Currency = rdr["Currency"].ToString();
                    operation.OprTypeId = Convert.ToInt32(rdr["OprTypeId"]);
                    operation.RelationId = Convert.ToInt32(rdr["RelationId"]);
                    operation.Agent = rdr["Agent"].ToString();
                    operation.PaymentMethod = rdr["PaymentMethod"].ToString();
                    operation.Captured = Convert.ToInt32(rdr["Captured"]);
                    d = Convert.ToDateTime(rdr["CaptureOn"]);
                    operation.CapDateString = d.ToString("yyyy-MM-dd");
                    Operations.Add(operation);
                }
                con.Close();
            }
            return Operations;
        }      
        public static IList<Operation> GetAllSessionOperations(long SessionId, string connection = "")
        {
            List<Operation> Operations = new List<Operation>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetAllSessionOperations" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = SessionId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Operation operation = new Operation();
                    operation.Id = Convert.ToInt32(rdr["Id"]);
                    operation.DateStamp = Convert.ToDateTime(rdr["DateStamp"]);
                    operation.Amount = Convert.ToDecimal(rdr["Amount"]);
                    operation.Currency = rdr["Currency"].ToString();
                    operation.Description = rdr["Description"].ToString();
                    operation.OprType = rdr["PaymentType"].ToString();
                    operation.PaymentMethod = rdr["PaymentMethod"].ToString();
                    operation.PaymentMethodId = Convert.ToInt32(rdr["PaymentMethodId"]);
                    operation.CaptureOn = rdr["CaptureOn"]!=DBNull.Value ?Convert.ToDateTime(rdr["CaptureOn"]) :new DateTime();
                    operation.Captured = Convert.ToInt16(rdr["Captured"]);
                    operation.CancelationDate = rdr["CancelationDate"] != DBNull.Value ? Convert.ToDateTime(rdr["CancelationDate"]) : new DateTime();
                    Operations.Add(operation);
                }
                con.Close();
            }
            return Operations;
        }
        public static int CapturePayments(long SessionId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "CapturePayments" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = SessionId });
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return 1;
            }
        }     
        public static int CancelOperation(long OprId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "ReturnPaymentById" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@OprId", Value = OprId });
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return 1;
            }
        }        
        public static int ReturnPayments(long SessionId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "ReturnPayments" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = SessionId });
                con.Open();
                cmd.ExecuteNonQuery();
                con.Close();
                return 1;
            }
        }
        public static IList<Session> GetPaidSessions(long UID, string connection = "")
        {
            List<Session> sessions = new List<Session>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetPaidSessions" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    Session session = new Session();
                    session.Id = Convert.ToInt32(rdr["Id"]);
                    session.DateStamp = Convert.ToDateTime(rdr["DueDate"]);
                    session.Amount = Convert.ToDecimal(rdr["Amount"]);
                    session.Currency = rdr["Currency"].ToString();
                    session.Title = rdr["Title"].ToString();
                    session.Service = rdr["type"].ToString();
                    session.TutorName = rdr["HostName"].ToString();
                    session.TutorId = Convert.ToInt32(rdr["Host"]);
                    session.CaptureOn = rdr["DueDate"] !=DBNull.Value ?Convert.ToDateTime(rdr["DueDate"]) :new DateTime();
                    session.AutoCapture = true;
                    session.isPaid = Convert.ToBoolean(rdr["isPaid"]); ;
                    session.CancelationDate = rdr["CancelationDate"] != DBNull.Value ? Convert.ToDateTime(rdr["CancelationDate"]) : new DateTime();
                    sessions.Add(session);
                }
                con.Close();
            }
            return sessions;
        }
        public static IList<Session> GetAllSessions(string connection = "")
        {
            List<Session> sessions = new List<Session>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetAllSessions" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();

                while (rdr.Read())
                {
                    Session session = new Session();
                    session.Id = Convert.ToInt32(rdr["Id"]);
                    DateTime d = Convert.ToDateTime(rdr["DueDate"]);
                    session.DateString = d.ToString("yyyy-MM-dd");
                    session.Amount = Convert.ToDecimal(rdr["Amount"]);
                    session.Currency = rdr["Currency"].ToString();
                    session.Title = rdr["Title"].ToString();
                    session.Service = rdr["type"].ToString();
                    session.TutorName = rdr["HostName"].ToString();
                    session.TutorId = Convert.ToInt32(rdr["Host"]);
                    session.isPaid = Convert.ToBoolean(rdr["isPaid"]); ;
                    session.Operations = GetAllSessionOperations(session.Id, connection);
                    sessions.Add(session);
                }
                con.Close();
            }
            return sessions;
        }
        
        public static int SubmitOperation(Operation Opr=null, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "SaveOperation" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Amount", Value = Opr.Amount });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = Opr.UID});
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = Opr.ObjEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Currency", Value = Opr.Currency });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ServiceId", Value = Opr.ServiceId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Description", Value = Opr.Description });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@BillingInfoId", Value = Opr.BillingInfoId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Auto", Value = Opr.Auto });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationId", Value = Opr.RelationId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = Opr.TutorId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RelationEntity", Value = Opr.RelationEntity });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SerialId", Value = Opr.SerialId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SerialNb", Value = Opr.SerialNb });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@PaymentMethodId", Value = Opr.PaymentMethodId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@OprTypeId", Value = Opr.OprTypeId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Captured", Value = Opr.Captured });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CaptureOn", Value = Opr.CaptureOn });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RespId", Value = Opr.RespId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RespType", Value = Opr.RespType });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RespDetails", Value = Opr.RespDetails });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RespDate", Value = Opr.RespDate });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RespAttch", Value = Opr.RespAttch });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CancelationDate", Value = Opr.CancelationDate });
                if(Opr.billingInfo != null)
                {
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CardId", Value = Opr.billingInfo.CardId });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CardLast4dig", Value = Opr.billingInfo.CardLast4dig });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CardType", Value = Opr.billingInfo.CardType });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CardExpYear", Value = Opr.billingInfo.CardExpYear });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@CardExpMnth", Value = Opr.billingInfo.CardExpMnth });
                }
                SqlParameter outPutVal = new SqlParameter("@InsertedOpId", SqlDbType.Int);
                outPutVal.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPutVal);
                con.Open();
                //int OprId = (int)cmd.ExecuteScalar();
                cmd.ExecuteNonQuery();
                int OprId = Convert.ToInt32(outPutVal.Value);
                con.Close();
                return OprId;
            }
        }
        public static Boolean HasBillingInfo(long UID = 0, string connection = "")
        {
            Boolean isExist = false;
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePaymtBillinfo", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "HasBillingInfo" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    int RowNb = Convert.ToInt32(rdr["card"]);
                    isExist = RowNb==0? false : true;
                }
                con.Close();
                return isExist;
            }
        }
        public static BillingInfo GetBillingInfo(long UID = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("sp_ManagePaymtBillinfo", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetBillingInfo" });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    if (rdr.HasRows)
                    {
                        rdr.Read();
                        BillingInfo bl = new BillingInfo
                        {
                            UID = Convert.ToInt32(rdr["UID"]),
                            ObjEntityId = Convert.ToInt32(rdr["ObjEntityId"]),
                            CardId = rdr["CardId"].ToString(),
                            CardLast4dig = Convert.ToInt32(rdr["CardLast4dig"]),
                            CardType = rdr["CardType"].ToString(),
                            CardExpYear = rdr["CardExpYear"].ToString(),
                            CardExpMnth = rdr["CardExpMnth"].ToString(),
                        };
                        return bl;
                    }
                    con.Close();
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
            return null;
        }

        public static IDictionary<string, string> GetAppSettings(string connection = "")
        {
            IDictionary<string, string> Perc = new Dictionary<string, string>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAppSettings" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Perc.Add(rdr["key"].ToString(), rdr["Value"].ToString());
                }
                return Perc;
            }
        }        
        public static IDictionary<string, int> GetSerials(string connection = "")
        {
            IDictionary<string, int> list = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePaymtSerials", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetSerials" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    list.Add(rdr["keyword"].ToString(), Convert.ToInt32(rdr["Value"]));
                }
                return list;
            }
        }

        //get all lookup used in the payment controller
        public static IDictionary<string, int> GetLPymtkpDetails(int? lang = 1, string connection = "")
        {
            IDictionary<string, int> list = new Dictionary<string, int>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManagePayment", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookup" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Language", Value = lang });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    list.Add(rdr["Keyword"].ToString(), Convert.ToInt32(rdr["ID"]));
                }
                return list;
            }
        }

    }
}
