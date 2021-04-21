using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Shared
{
    public class StepsDB
    {
        public static IList<RegistrationStep> FetchSteps(long uId = 0, byte ObjEntityId = 0, int? lang = null, string connection = "")
        {
            IList<RegistrationStep> cs = new List<RegistrationStep>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetUserSteps" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = uId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId ", Value = ObjEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Lang ", Value = lang });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    RegistrationStep step = new RegistrationStep
                    {
                        UId = uId,
                        Id = Convert.ToInt32(rdr["Id"]),
                        UIName = rdr["RelUIObject"] != DBNull.Value ? rdr["RelUIObject"].ToString() : "Undefined",
                        StepDescription = rdr["Description"].ToString(),
                        ObjEntityId = Convert.ToByte(rdr["ObjEntityId"]),
                        RegistrationStepId = rdr["RegistrationStepId"] != DBNull.Value ? Convert.ToInt32(rdr["RegistrationStepId"]) : default(long?),
                        Completed = Convert.ToBoolean(rdr["StepStatus"]),
                        Visited = Convert.ToBoolean(rdr["Visited"])
                    };
                    cs.Add(step);
                }
                con.Close();
            }
            return cs;
        }

        public static bool CheckCompletedSteps(long uId = 0, int registrationStepId = 0, byte? objEntityId = 0, string connection = "")
        {
            bool StepCompleted = false;
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_RegistrationSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "CheckStep"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UId",
                    Value = uId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RegistrationStepId",
                    Value = registrationStepId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjEntityId",
                    Value = objEntityId
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    StepCompleted = Convert.ToBoolean(rdr["StepStatus"]);
                }
            }
            return StepCompleted;
        }
        public static bool VisitRegStep(long uId = 0, int stepId = 0, byte? objEntityId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "RegistrationStepVisited" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = uId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@StepId ", Value = stepId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = objEntityId });
                con.Open();
                int rows = cmd.ExecuteNonQuery();
                con.Close();
                return rows > 0;
            }
        }
        public static bool CompleteRegStep(long uId = 0, int stepId = 0, byte? objEntityId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "RegistrationStepComplete" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = uId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@StepId ", Value = stepId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = objEntityId });
                con.Open();
                int rows = cmd.ExecuteNonQuery();
                con.Close();
                return rows > 0;
            }
        }
        public static RegistrationStep NextRegStep(long uId = 0, int? stepId = 0, byte? objEntityId = 0, int? lang = null, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "NextStep" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = uId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@StepId ", Value = stepId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = objEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Lang", Value = lang });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                    RegistrationStep step = new RegistrationStep
                    {
                        UId = uId,
                        Id = Convert.ToInt32(rdr["Id"]),
                        UIName = rdr["RelUIObject"] != DBNull.Value ? rdr["RelUIObject"].ToString() : "Undefined",
                        StepDescription = rdr["Description"].ToString(),
                        ObjEntityId = Convert.ToByte(rdr["ObjEntityId"]),
                        RegistrationStepId = rdr["RegistrationStepId"] != DBNull.Value ? Convert.ToInt32(rdr["RegistrationStepId"]) : default(long?),
                        Completed = Convert.ToBoolean(rdr["StepStatus"]),
                        Visited = Convert.ToBoolean(rdr["Visited"])
                    };
                    con.Close();

                    return step;
                }
            }
            return null;
        }
    }
}
