using BLL.Shared;
using BLL.Steps;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace DAL.Shared
{
    public class StepsDB
    {
        public IList<RegistrationSteps> FetchCompletedSteps(int UID, string ObjEntityId, string connection)
        {
            IList<RegistrationSteps> cs = new List<RegistrationSteps>();            
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_RegistrationSteps", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UID",
                    Value = UID
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjEntityId ",
                    Value = ObjEntityId
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    RegistrationSteps step = new RegistrationSteps();
                    step.ObjId= Convert.ToInt32(rdr["UID"]);
                    step.ObjEntityId = Convert.ToInt32(rdr["ObjEntityId"]);
                    step.RegistrationStepId = Convert.ToInt32(rdr["RegistrationStepId"]);
                    //step.StepId = Convert.ToInt32(rdr["StepId"]);
                    //step.StepDescription= rdr["Contentkey"].ToString();
                    step.Completed = Convert.ToInt32(rdr["StepStatus"]);
                    cs.Add(step);
                }
                con.Close();

            }
            return cs;
        }

        public Boolean CheckCompletedSteps(long UID,int RegistrationStepId,long ObjEntityId,string connection)
        {
            Boolean StepCompleted = false;
            using(SqlConnection con=new SqlConnection(connection))
                {
                SqlCommand cmd = new SqlCommand("sp_CheckStep", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@UID",
                        Value= UID
                    });
                cmd.Parameters.Add(new SqlParameter()
                    {
                    ParameterName = "@RegistrationStepId",
                    Value = RegistrationStepId
                    });
                cmd.Parameters.Add(new SqlParameter()
                    {
                    ParameterName = "@ObjEntityId",
                    Value = ObjEntityId
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
    }
}
