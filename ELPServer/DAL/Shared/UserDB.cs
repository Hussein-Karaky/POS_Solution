using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using BLL.Shared;
using BLL.Tutor;

namespace DAL.Shared
{
    public class UserDB
    {
        //string connection = "Data Source=DESKTOP-U1O7S49;Initial Catalog=INTODB;Integrated Security=True";

       public TutorProfile UserLogin(string Email,string Password,string connection)
        {

            TutorProfile tutorProfile = new TutorProfile();
            tutorProfile = null;
          
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "CheckLogin"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Email",
                    Value = Email
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Password",
                    Value = Password
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();


                while (rdr.Read())
                {
                    TutorProfile tp = new TutorProfile();
                    tp.UserId = Convert.ToInt64(rdr["ID"]);
                    tp.FirstName =rdr["FirstName"].ToString();
                    tp.LastName= rdr["LastName"].ToString();
                    tp.Id = Convert.ToInt64(rdr["TutorId"]);
                    tutorProfile = tp;
                }
                con.Close();
               
            }
            return tutorProfile;
        }
        //To be discussed !! (What to return)
        public TutorProfile UserSignUp(string FirstName,string LastName,string Email, string Password,int CountryId,string connection)
        {

            TutorProfile us = new TutorProfile();
            us = null;

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Insert"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@FirstName",
                    Value = FirstName
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LastName",
                    Value = LastName
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Email",
                    Value = Email
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Password",
                    Value = Password
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CountryId",
                    Value = CountryId
                });
                //@ObjName
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjName",
                    Value = "Tutor"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName= "@LanguageId",
                    Value=1
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName="@Active",
                    Value=1
                });
                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                    us=UserLogin(Email, Password,connection);
                    return us;

                }
                catch (Exception)
                {
                    return us;
                    
                }

                

            }
            
        }

        public Registration UserNameExists(string Email,string connection)
        {
            bool userNameInUse = false;

            
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "CheckUserName"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Email",
                    Value = Email
                });

                con.Open();
                userNameInUse = Convert.ToBoolean(cmd.ExecuteScalar());
            }

            Registration regsitration = new Registration();
            regsitration.UserName = Email;
            regsitration.UserNameInUse = userNameInUse;
            return regsitration;
           
        }



    }
}
