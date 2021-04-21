using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace DAL.Shared
{
    public class LookUpDB
    {
        public static IList<LookUpDetails> GetLookupDetails(int LookupId = 0, string connection = "")
        {
            IList<LookUpDetails> lud = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Countries
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookupDetails" });
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                DataTable dt = new DataTable();
                da.Fill(dt);
                lud = GetlookupDetails(dt, LookupId);
                return lud;
            }
        }
        public static IList<LookUpDetails> GetLookupDetails(int lookupId = 0, string keyword = null, int? lang = 1, string dataType = null, string connection = "")
        {
            IList<LookUpDetails> lkps = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Countries
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookupDetailsbyAbbreviation" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Abbreviation", Value = keyword });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LookupId", Value = lookupId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@DataType", Value = dataType });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails lkp = new LookUpDetails();
                    lkp.Id = Convert.ToInt32(rdr["LookupId"]);
                    lkp.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    lkp.LookupDetailsDescription = rdr["Description"].ToString();
                    lkps.Add(lkp);
                }
            }
            return lkps;
        }
        public static IList<LookUpDetails> GetInstituteTypes(string connection = "")
        {
            List<LookUpDetails> InstituteTypes = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "InstituteTypes" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails instituteType = new LookUpDetails();
                    instituteType.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    instituteType.LookupDetailsDescription = rdr["Keyword"].ToString();
                    InstituteTypes.Add(instituteType);
                }
            }
            return InstituteTypes;
        }
        public static IList<LookUpDetails> GetAllCurriculum(string connection = "")
        {
            List<LookUpDetails> Curriculum = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "Curriculum" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails curriculum = new LookUpDetails();
                    curriculum.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    curriculum.LookupDetailsDescription = rdr["Keyword"].ToString();
                    Curriculum.Add(curriculum);
                }
            }
            return Curriculum;
        }
        public static IList<LookUpDetails> GetAllClasses(string connection = "")
        {
            List<LookUpDetails> Classes = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "Classes" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails classes = new LookUpDetails();
                    classes.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    classes.LookupDetailsDescription = rdr["ClassName"].ToString();
                    Classes.Add(classes);
                }
            }
            return Classes;
        }
        public static IList<LookUpDetails> GetAllSubjects(string connection = "")
        {
            List<LookUpDetails> Subjects = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "Subjects" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails subjects = new LookUpDetails();
                    subjects.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    subjects.LookupDetailsDescription = rdr["Keyword"].ToString();
                    Subjects.Add(subjects);
                }
            }
            return Subjects;
        }
        public static IList<LookUpDetails> GetAllTutorServices(string connection = "")
        {
            List<LookUpDetails> Services = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "TutorServices" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails services = new LookUpDetails();
                    services.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    services.Keyword = rdr["Keyword"].ToString();
                    services.LookupDetailsDescription = rdr["Description"].ToString();
                    services.Context = rdr["Context"].ToString();
                    Services.Add(services);
                }
            }
            return Services;
        }

        public static IDictionary<string, string> GetTranslation(string compositeKey, int langId = 1, string connection = "")
        {
            IDictionary<string, string> lupDetails = new Dictionary<string, string>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting AppContent
                SqlCommand cmd = new SqlCommand("sp_GetLookUp", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LangId", Value = langId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Key", Value = compositeKey });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAppContents" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    if (rdr["Keyword"] != DBNull.Value) {
                        lupDetails.Add(rdr["Keyword"].ToString(), rdr["Description"].ToString());
                    }
                }
                return lupDetails;
            }
        }

        public static IList<LookUpDetails> GetlookupDetails(DataTable dt = null, int lookupId = 0)
        {
            if (dt != null && dt.Rows.Count > 0)
                return dt.AsEnumerable().Where(r => int.Parse(r["LookupId"].ToString()) == lookupId).Select(f => new LookUpDetails { LookupDetailsDescription = f["Description"].ToString(), LookupDetailsId = Convert.ToInt32(f["ID"]) }).ToList<LookUpDetails>();

            return new List<LookUpDetails>();
        }
        // used for Tutor Question Blogs 
        public static IList<LookUpDetails> GetLookUpDetails(int LookupId = 0, int LanguageId = 1, string connection = "")
        {
            IList<LookUpDetails> lud = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Categories
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookupDetailsWithKeyWord" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = LanguageId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LookupId", Value = LookupId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails l = new LookUpDetails();
                    l.Id = Convert.ToInt32(rdr["ID"]);
                    l.LookupDetailsDescription = rdr["Description"].ToString();
                    l.DataType= rdr["DataType"].ToString();
                    l.Context= rdr["Context"].ToString();
                    l.LanguageId=LanguageId;
                    l.Keyword=rdr["Keyword"].ToString();
                    lud.Add(l);
                }
                return lud;
            }
        }
        public static IList<LookUpDetails> FillTutorQuestionDropDown(int LookupId = 0, int LanguageId = 1, string connection = "")
        {
            IList<LookUpDetails> lud = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Categories
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookupDetails" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = LanguageId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LookupId", Value = LookupId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails l = new LookUpDetails();
                    l.Id = Convert.ToInt32(rdr["ID"]);
                    l.LookupDetailsDescription = rdr["Description"].ToString();
                    l.DataType= rdr["DataType"].ToString();
                    l.Context= rdr["Context"].ToString();
                    l.LanguageId=LanguageId;
                    lud.Add(l);
                }
                return lud;
            }
        }
        public static IList<LookUpDetails> GetAppContent(string LookupIds = "", int LangId = 0, string connection = "")
        {
            IList<LookUpDetails> lupDetails = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting AppContent
                SqlCommand cmd = new SqlCommand("sp_GetLookUp", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LangId", Value = LangId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LookupIds", Value = LookupIds });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails l = new LookUpDetails();
                    l.Id = Convert.ToInt32(rdr["ID"]);
                    l.LookupDetailsDescription = rdr["Description"].ToString();
                    lupDetails.Add(l);
                }
                return lupDetails;
            }
        }
        public static string GetAppContent(int lkpdId, int langId = 1, string keyword = null, string connection = "")
        {
            IList<LookUpDetails> lupDetails = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting AppContent
                SqlCommand cmd = new SqlCommand("sp_Content", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LangId", Value = langId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LookupId", Value = lkpdId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Keyword", Value = keyword });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    rdr.Read();
                        return rdr["Description"].ToString();
                }
                return "";
            }
        }
        //Nabih get Translated text by Abbreviation
        public static IList<LookUpDetails> GetLkupByAb(string keyword = null, int? lang = 1, string connection = "")
        {
            IList<LookUpDetails> lkps = new List<LookUpDetails>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetLookupDetailsbyAbbreviation" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Abbreviation", Value = keyword });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = lang });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    LookUpDetails lkp = new LookUpDetails();
                    lkp.Id = Convert.ToInt32(rdr["LookupId"]);
                    lkp.LookupDetailsId = Convert.ToInt32(rdr["ID"]);
                    lkp.LanguageId = Convert.ToInt32(lang);
                    lkp.LookupDetailsDescription = rdr["Description"].ToString();
                    lkp.Keyword = rdr["Keyword"].ToString();
                    lkps.Add(lkp);
                }
            }
            return lkps;
        }
    }
}
