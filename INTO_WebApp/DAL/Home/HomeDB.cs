using BLL.Home;
using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Home
{
    public class HomeDB
    {
        public static IList<Review> GetReviews(int languageId = 1, string connection = "")
        {
            List<Review> Reviews = new List<Review>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageHomeInfo", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "getReviews" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@languageId", Value = languageId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Review Review = new Review();
                    Review.FullName = rdr["FullName"].ToString();
                    Review.Photo = rdr["photo"].ToString();
                    Review.review = rdr["Review"].ToString();
                    Reviews.Add(Review);
                }
                con.Close();
            }
            return Reviews;
        }
        public static DataTable GetStatistics(string connection = "")
        {
            DataTable dt = new DataTable();
                dt.Columns.Add("Reviews");
                dt.Columns.Add("Tutors");
                dt.Columns.Add("Languages");
                dt.Columns.Add("Schools");
                dt.Columns.Add("Nationalities");
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageHomeInfo", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "getStat" });

                SqlParameter outReviews = new SqlParameter("@reviews", SqlDbType.Int);
                outReviews.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outReviews);
                SqlParameter outTutors = new SqlParameter("@Tutors", SqlDbType.Int);
                outTutors.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outTutors);
                SqlParameter outLanguages = new SqlParameter("@Languages", SqlDbType.Int);
                outLanguages.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outLanguages);
                SqlParameter outSchools = new SqlParameter("@Schools", SqlDbType.Int);
                outSchools.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outSchools);
                SqlParameter outNationalities = new SqlParameter("@Nationalities", SqlDbType.Int);
                outNationalities.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outNationalities);

                con.Open();
                cmd.ExecuteNonQuery();
                DataRow row = dt.NewRow();
                row["Reviews"] = Convert.ToInt32(outReviews.Value);
                row["Tutors"] = Convert.ToInt32(outTutors.Value);
                row["Languages"] = Convert.ToInt32(outLanguages.Value);
                row["Schools"] = Convert.ToInt32(outSchools.Value);
                row["Nationalities"] = Convert.ToInt32(outNationalities.Value);
                con.Close();
                return dt;
            }
        }
        public static IList<Language> GetLanguages(string connection = "")
        {
            List<Language> Languages = new List<Language>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageHomeInfo", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "getLanguages" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Language l = new Language();
                    l.Id = Convert.ToInt32(rdr["Id"]);
                    l.Code = rdr["code"].ToString();
                    Languages.Add(l);
                }
                return Languages;
            }
        }        
    }
}
