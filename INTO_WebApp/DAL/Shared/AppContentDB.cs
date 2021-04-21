using BLL.Shared;
using BLL.Shared.Notif;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Shared
{
    public class AppContentDB
    {
        public static IList<Language> GetLanguages(string connection = "")
        {
            List<Language> Languages = new List<Language>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageLanguages", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Language language = new Language
                    {
                        Id = Convert.ToInt32(rdr["Id"]),
                        Description = rdr["Description"].ToString(),
                        RTL = Convert.ToBoolean(rdr["RTL"]),
                        Code = rdr["ISO_639_1Code"] != DBNull.Value ? rdr["ISO_639_1Code"].ToString() : "en"
                };
                    Languages.Add(language);
                }
            }
            return Languages;
        }

        public static IList<AppContent> GetAppContent(string AppContentsIds = "", int LangId = 0, string connection = "")
        {
            IList<AppContent> appcontents = new List<AppContent>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting AppContent
                SqlCommand cmd = new SqlCommand("sp_ManageAppContents", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetDisplayContent" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = LangId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@AppContentsId", Value = AppContentsIds });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    AppContent appcontent = new AppContent();
                    appcontent.Id = Convert.ToInt32(rdr["AppContentsId"]);
                    appcontent.LangId = Convert.ToInt32(rdr["LanguageId"]);
                    appcontent.DisplayContent = rdr["DisplayContent"].ToString();
                    appcontents.Add(appcontent);
                }
                return appcontents;
            }
        }

        public static IList<Country> GetCountries(string connection = "")
        {
            List<Country> Countries = new List<Country>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageCountries", con);
                cmd.CommandType = CommandType.StoredProcedure;
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Country country = new Country();
                    country.Id = Convert.ToInt32(rdr["ID"]);
                    country.Name = rdr["Name"].ToString();
                    country.Code = rdr["Code"].ToString();
                    country.Location = new Location
                    {
                        Latitude = Convert.ToDecimal(rdr["Latitude"]),
                        Longitude = Convert.ToDecimal(rdr["Longitude"])
                    };
                    country.ISOCode = rdr["ISOCode"] != DBNull.Value ? rdr["ISOCode"].ToString() : null;
                    country.Alpha3Code = rdr["Alpha3Code"] != DBNull.Value ? rdr["Alpha3Code"].ToString() : null;
                    country.Alpha2Code = rdr["Alpha2Code"] != DBNull.Value ? rdr["Alpha2Code"].ToString() : null;
                    country.Currency = new Currency
                    {
                        Code = rdr["Currency"] != DBNull.Value ? rdr["Currency"].ToString() : null,
                        NumCode = rdr["CurrencyNumeric"] != DBNull.Value ? Convert.ToInt16(rdr["CurrencyNumeric"]) : default(short?)
                    };
                    Countries.Add(country);
                }
            }
            return Countries;
        }
        public static IList<SourceRecipient> GetSourceRecipients(string connection = "")
        {
            IList<SourceRecipient> recipients = new List<SourceRecipient>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageSystem", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "srcRecip" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    recipients.Add(new SourceRecipient
                    {
                        Id = Convert.ToInt32(rdr["Id"]),
                        Name = rdr["Name"] != DBNull.Value ? rdr["Name"].ToString() : null,
                        Address = rdr["Address"].ToString(),
                        Password = rdr["Password"].ToString(),
                        SmtpServer = rdr["SmtpServer"].ToString(),
                        SmtpPort = Convert.ToInt32(rdr["SmtpPort"]),
                        SendingLimits = Convert.ToInt32(rdr["SendingLimits"])
                    });
                }
            }
            return recipients;
        }
    }
}
