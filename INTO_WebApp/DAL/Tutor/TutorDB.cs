using BLL.Search;
using BLL.Shared;
using BLL.Shared.Notif;
using BLL.Shared.Struct;
using BLL.Tutor;
using DAL.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using TutorType = BLL.Tutor.Tutor;

namespace DAL.Tutor
{
    public class TutorDB
    {
        public static BLL.Tutor.Tutor SaveTutorProfile(BLL.Tutor.Tutor profile = null, string connection = "")
        {
            //sql procedure
            DataTable dt = new DataTable();
            dt.Columns.Add("Institute");
            dt.Columns.Add("Major");
            dt.Columns.Add("DegreeId");
            foreach (var item in profile.Education)
            {
                var row = dt.NewRow();
                row["Institute"] = Convert.ToString(item.Institute);
                row["Major"] = Convert.ToString(item.Major);
                row["DegreeId"] = Convert.ToInt32(item.DegreeId);

                dt.Rows.Add(row);
            }

            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Countries
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "SaveBasicInfo"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RecognitionId",
                    Value = profile.Recognition
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UId",
                    Value = profile.UserId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ID",
                    Value = profile.Id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TutorEducation",
                    Value = dt
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Gender",
                    Value = profile.Gender
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CancellationNotice",
                    Value = profile.CancellationNotice
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Address",
                    Value = profile.LocationSettings.Address
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Address2",
                    Value = profile.LocationSettings.SecondAddress
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@City",
                    Value = profile.LocationSettings.City
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CountryId",
                    Value = profile.LocationSettings.Country.Id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Phone",
                    Value = profile.Phone
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@DOB",
                    Value = profile.DOB.HasValue ? (profile.DOB.Value).ToString("yyyy-MM-dd") : null
                });
                //cmd.Parameters.Add(new SqlParameter()
                //{
                //    ParameterName = "@TravelRadius",
                //    Value = 8
                //});
                con.Open();
                cmd.ExecuteNonQuery();
            }
            return profile;
        }

        public static IList<Subject> SaveTutorSubjectsAndMaterials(DataTable dt = null, int? lang = 1, string conStr = "")
        {
            IList<Subject> subjects = new List<Subject>();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_TutorSubjects", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "SaveTutorSubjects"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = lang
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TutorSubjects",
                    TypeName = "udt_TutorSubjects",
                    SqlDbType = SqlDbType.Structured,
                    Value = dt
                });
                con.Open();
                try
                {
                    SqlDataReader rdr = cmd.ExecuteReader();
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            Subject subject = new Subject();
                            Material material = new Material();
                            subject.Id = Convert.ToInt32(rdr["SubjectId"]);
                            subject.Name = rdr["SubjectName"].ToString();
                            material.SysId = Convert.ToInt32(rdr["Id"]);
                            material.Id = Convert.ToInt32(rdr["MaterialId"]);
                            material.Name = rdr["MaterialName"].ToString();
                            subject.materials.Add(material);
                            subjects.Add(subject);

                        }
                    }
                }
                catch (Exception ex)
                {
                    //To Log
                }
                return subjects;
            }
        }
        public static DataList<Material> GetMaterials(long id, int? lang = null, string conStr = "")
        {
            IList<Material> materials = new List<Material>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_TutorSubjects", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetTutorMaterials" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        materials.Add(new Material
                        {
                            SysId = Convert.ToInt32(rdr["SubjectMaterialId"]),
                            Id = Convert.ToInt32(rdr["MaterialId"]),
                            Name = rdr["MaterialName"].ToString(),
                            Subject = new Subject
                            {
                                Id = Convert.ToInt32(rdr["SubjectId"]),
                                Name = rdr["SubjectName"].ToString()
                            },
                            Curriculum = new Curriculum
                            {
                                Id = Convert.ToInt32(rdr["CurriculumId"]),
                                Name = rdr["CurriculumName"].ToString()
                            },
                            Cycle = new ScholarCycle
                            {
                                Id = Convert.ToInt32(rdr["CycleId"]),
                                Name = rdr["CycleName"].ToString()
                            },
                            InstituteType = new InstituteType
                            {
                                Id = Convert.ToInt32(rdr["InstituteTypeId"]),
                                Name = rdr["InstituteTypeName"].ToString()
                            },
                            Passed = Convert.ToBoolean(rdr["Passed"]),
                            Approved = Convert.ToBoolean(rdr["Approved"]),
                            Active = Convert.ToBoolean(rdr["Active"]),
                            Certified = rdr["Certified"] != DBNull.Value ? Convert.ToInt32(rdr["Certified"]) : 0,
                            Points = Convert.ToByte(rdr["Points"])
                        });
                    }
                }
                connection.Close();
            }
            return new DataList<Material>(materials);
        }

        public static IList<TutorRate> GetRates(long? id = null, int? material = null, int lang = 1, string conStr = "")
        {
            IList<TutorRate> rates = new List<TutorRate>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_TutorSubjects", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetRates" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SubjectMaterialId", Value = material });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        rates.Add(new TutorRate(rdr));
                    }
                }
                connection.Close();
            }
            return rates;
        }

        public static IList<TutorEducation> GetEducation(long id, int? lang = null, string conStr = "")
        {
            IList<TutorEducation> educations = new List<TutorEducation>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetEducation" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        educations.Add(SqlDataReaderToTutorEducation(rdr));
                    }
                }
                connection.Close();
            }
            return educations;
        }
        public static TutorEducation SqlDataReaderToTutorEducation(SqlDataReader rdr)
        {
            return new TutorEducation
            {
                Id = Convert.ToInt64(rdr["EduId"]),
                TutorId = rdr["Id"] != DBNull.Value ? Convert.ToInt64(rdr["Id"]) : default(long?),
                Institute = rdr["Institute"] != DBNull.Value ? rdr["Institute"].ToString() : "",
                Major = rdr["Major"] != DBNull.Value ? rdr["Major"].ToString() : "",
                DegreeId = rdr["DegreeId"] != DBNull.Value ? Convert.ToInt32(rdr["DegreeId"]) : default(int?),
                Degree = rdr["Degree"] != DBNull.Value ? rdr["Degree"].ToString() : ""
            };
        }
        public static IList<TutorEducation> SaveEducation(IList<TutorEducation> educations, long id, int? lang = null, string conStr = "")
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                DataTable dtEducation = new DataTable();
                dtEducation.Columns.Add("Institute", typeof(string));
                dtEducation.Columns.Add("Major", typeof(string));
                dtEducation.Columns.Add("Degree", typeof(int));
                ((List<TutorEducation>)educations).ForEach(d =>
                {
                    DataRow row = dtEducation.NewRow();
                    row["Institute"] = d.Institute;
                    row["Major"] = d.Major;
                    row["Degree"] = d.DegreeId;
                    dtEducation.Rows.Add(row);
                });
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@TutorEducation",
                    TypeName = "udt_TutorEducation",
                    SqlDbType = SqlDbType.Structured,
                    Value = dtEducation
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    SqlDbType = SqlDbType.VarChar,
                    Value = "SaveEducation"
                });

                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    educations.Clear();
                    while (reader.Read())
                    {
                        educations.Add(SqlDataReaderToTutorEducation(reader));
                    }
                }
            }
            return educations;
        }
        public static string Title(long id, string title = null, string conStr = "")
        {
            string tutorTitle = title;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Title"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Title",
                    Value = title
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        tutorTitle = rdr["Title"].ToString();
                    }
                }
            }
            return tutorTitle;
        }
        public static string FreeResponse(long id, string freeResp = null, string conStr = "")
        {
            string tutorFreeResp = freeResp;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "FreeResponse"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@FreeResponse",
                    Value = freeResp
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        tutorFreeResp = rdr["FreeResponse"].ToString();
                    }
                }
            }
            return tutorFreeResp;
        }
        public static int BizSettings(long id, int? cancelNotice = null, int lang = 1, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "bizSettings"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CancellationNotice",
                    Value = cancelNotice
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = lang
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        cancelNotice = rdr["CancellationNotice"] != DBNull.Value ? Convert.ToInt32(rdr["CancellationNotice"]) : default(int?);
                    }
                }
            }
            return cancelNotice.HasValue ? cancelNotice.Value : 0;
        }

        public static int Biz(Material material, long id, int lang = 1, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                DataTable dtRates = new DataTable();
                dtRates.Columns.Add("TutorId", typeof(long));
                dtRates.Columns.Add("MaterialSysId", typeof(int));
                dtRates.Columns.Add("LessonType", typeof(int));
                dtRates.Columns.Add("Price", typeof(decimal));
                dtRates.Columns.Add("Cur", typeof(int));
                ((List<TutorRate>)material.Pricing).ForEach(d =>
                {
                    DataRow row = dtRates.NewRow();
                    row["TutorId"] = d.TutorId;
                    row["MaterialSysId"] = d.MaterialId;
                    row["LessonType"] = d.LessonType;
                    row["Price"] = d.Price;
                    row["Cur"] = d.Currency;
                    dtRates.Rows.Add(row);
                });
                SqlCommand cmd = new SqlCommand("sp_TutorSubjects", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "UpdateMaterial"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@SubjectMaterialId",
                    Value = material.SysId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Active",
                    Value = material.Active
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TutorRate",
                    TypeName = "udt_TutorRate",
                    SqlDbType = SqlDbType.Structured,
                    Value = dtRates
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = lang
                });
                con.Open();
                int rows = 0;
                try
                {
                    rows = cmd.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    return 0;
                }
                return rows;
            }
        }

        public static int SaveAgreement(long uId = 0, int objEntityId = 0, int registrationStepId = 0, int stepStatus = 0,
                                string LegalFN = "", string LegalLN = "", string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "SaveAgreement"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UId",
                    Value = uId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjEntityId",
                    Value = objEntityId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RegistrationStepId",
                    Value = registrationStepId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@StepStatus",
                    Value = stepStatus
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LegalFN",
                    Value = LegalFN
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LegalLN",
                    Value = LegalLN
                });
                con.Open();
                int rows = cmd.ExecuteNonQuery();


                return rows;
            }
        }
        public static TutorType PrepareForConfirmation(long userId, int objEntityId, int stepId, string actUrl = "", int? lang = 1, string conStr = "")
        {
            const int MAXIMUM_PASSWORD_ATTEMPTS = 10000;
            bool includeLowercase = true;
            bool includeUppercase = true;
            bool includeNumeric = true;
            bool includeSpecial = false;
            int lengthOfPassword = 16;

            PasswordGeneratorSettings settings = new PasswordGeneratorSettings(includeLowercase, includeUppercase, includeNumeric, includeSpecial, lengthOfPassword);
            string actCode;
            if (!settings.IsValidLength())
            {
                actCode = settings.LengthErrorMessage();
            }
            else
            {
                int passwordAttempts = 0;
                do
                {
                    actCode = PasswordGenerator.GeneratePassword(settings);
                    passwordAttempts++;
                }
                while (passwordAttempts < MAXIMUM_PASSWORD_ATTEMPTS && !PasswordGenerator.PasswordIsValid(settings, actCode));

                actCode = PasswordGenerator.PasswordIsValid(settings, actCode) ? actCode : "Try again";
            }
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "CheckAgreement"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjEntityId",
                    Value = objEntityId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RegistrationStepId",
                    Value = stepId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ActivationCode",
                    Value = actCode
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TutorType tutor = null;
                if (rdr.HasRows)
                {
                    rdr.Read();
                    tutor = new TutorType(rdr);
                }
                bool success = false;
                if (tutor != null)
                {
                    //TODO: Notify SecondaryEmail first if any.
                    string htmlString = "<html><body><h1>Dear " + tutor.FirstName + ",</h1><br/>" +
                        "<h6>Please click on the link below to confirm our business agreement:</h6><br/><br/>" +
                        "<a href='" + actUrl + "/" + tutor.UserId + "/" + actCode + "/" + stepId + "/" + lang + "'>Ready For The Interview</a></body></html>";
                    success = new EmailNotifier
                    {
                        From = "into.devteam@gmail.com",//TODO: Read from DB
                        Password = "Into@1234",//TODO: Read from DB
                        To = new string[] { tutor.Email },
                        Subject = "INTO Tutoring Agreement",
                        Body = htmlString,
                        IsBodyHtml = true,
                        SmtpServer = "smtp.gmail.com",
                        SmtpPort = 587,
                        IsSSL = true
                    }.Notify();
                }

                return tutor;
            }

        }
        public static int ReadyForInterview(long id, string activationCode, int step = 0, string conStr = "")
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "ReadyForInterview" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UId", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ActivationCode", Value = activationCode });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RegistrationStepId", Value = step });
                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();
                return rows;
            }
        }

        public static BLL.Tutor.Tutor GetProfile(int id = 0) // to be removed later
        {
            return new BLL.Tutor.Tutor
            {
                Id = 1,
                LegalFN = "Hussein",
                LegalLN = "Ibrahim"
            };
        }

        public static int SavePreferences(TutorPreferences tprf = null, long? userId = null, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "SavePreferences"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjEntityId",
                    Value = tprf.TutorId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RegistrationStepId",
                    Value = 1
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@StepStatus",
                    Value = 1
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@IsTeacher",
                    Value = tprf.IsTeacher
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TeachingInstitute",
                    Value = tprf.TeachingInstitute
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@YearsOfExperience",
                    Value = tprf.YearsOfExperience
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TutoringTypes",
                    Value = tprf.TutoringTypes
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LessonTypes",
                    Value = tprf.LessonTypes
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@RewardingPoints",
                    Value = tprf.RewardingPoints
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@HasCar",
                    Value = tprf.HasCar
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@OutsideTutoringWeekHrs",
                    Value = tprf.OutsideTutoringWeekHrs
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = tprf.TutorId
                });
                con.Open();
                cmd.ExecuteNonQuery();
                return 1;
            }
        }
        public static IList<TutorPreferences> GetPreferences(long? id = null, string connection = "")
        {
            IList<TutorPreferences> prefs = new List<TutorPreferences>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutor", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "GetPreferences"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                con.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        prefs.Add(new TutorPreferences(reader));
                    }
                }
                return prefs;
            }
        }
        public static ICollection<SearchResult<TutorType>> Search(SearchFilter searchFilter, string conStr = "")
        {
            IDictionary<long, SearchResult<TutorType>> searchResults = new Dictionary<long, SearchResult<TutorType>>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                //TODO:fetch from db 
                DataTable dtAvail = new DataTable();
                dtAvail.Columns.Add("DayId", typeof(byte));
                dtAvail.Columns.Add("DayTimeId", typeof(long));
                foreach (BriefAvailability t in searchFilter.Availability)
                {
                    DataRow row = dtAvail.NewRow();
                    row["DayId"] = t.Day.Id;
                    row["DayTimeId"] = t.Time.Id;
                    dtAvail.Rows.Add(row);
                }
                SqlCommand cmd = new SqlCommand("sp_TutorSearchPaging", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@StdAvail",
                    TypeName = "udt_StudentAvailability",
                    SqlDbType = SqlDbType.Structured,
                    Value = dtAvail
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    SqlDbType = SqlDbType.VarChar,
                    Value = "Advanced"
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@LanguageId",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.Language
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MinInPersonHourRate",
                    SqlDbType = SqlDbType.Decimal,
                    Value = searchFilter.MinInPersonHourRate
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MaxInPersonHourRate",
                    SqlDbType = SqlDbType.Decimal,
                    Value = searchFilter.MaxInPersonHourRate
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MinOnlineHourRate",
                    SqlDbType = SqlDbType.Decimal,
                    Value = searchFilter.MinOnlineHourRate
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MaxOnlineHourRate",
                    SqlDbType = SqlDbType.Decimal,
                    Value = searchFilter.MaxOnlineHourRate
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MinAge",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.MinTutorAge
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@MaxAge",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.MaxTutorAge
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@SearchColumn",
                    SqlDbType = SqlDbType.VarChar,
                    Value = searchFilter.SearchColumn
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@SearchValue",
                    SqlDbType = SqlDbType.VarChar,
                    Value = searchFilter.SearchValue
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@PageNo",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.PageNumber
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@PageSize",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.PageSize
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@SortColumn",
                    SqlDbType = SqlDbType.VarChar,
                    Value = searchFilter.SortingColumn
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@SortOrder",
                    SqlDbType = SqlDbType.Bit,
                    Value = searchFilter.SortingDirection
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Gender",
                    SqlDbType = SqlDbType.Bit,
                    Value = searchFilter.Gender
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Country",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.Country
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Service",
                    SqlDbType = SqlDbType.BigInt,
                    Value = searchFilter.TutoringService
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@AcademicLevel",
                    SqlDbType = SqlDbType.BigInt,
                    Value = searchFilter.AcademicLevel
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Curriculum",
                    SqlDbType = SqlDbType.BigInt,
                    Value = searchFilter.Curriculum
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Class",
                    SqlDbType = SqlDbType.BigInt,
                    Value = searchFilter.EducationClass
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Material",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.Subject
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@TutoringLang",
                    SqlDbType = SqlDbType.Int,
                    Value = searchFilter.Language
                });
                connection.Open();
                try
                {
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            long userId = Convert.ToInt64(reader["UId"]);
                            if (!searchResults.ContainsKey(userId))
                            {
                                searchResults.Add(userId, new SearchResult<TutorType>
                                {
                                    SearchContent = new TutorType(reader)
                                });
                            }
                            int sysId = Convert.ToInt32(reader["SysId"]);
                            long priceId = Convert.ToInt64(reader["RateId"]);
                            Material material = ((List<Material>)searchResults[userId].SearchContent.Materials).Find(m => m.SysId == sysId);
                            if (material == null)
                            {
                                material = new Material
                                {
                                    SysId = sysId,
                                    Id = Convert.ToInt32(reader["MaterialId"]),
                                    Name = reader["MaterialName"].ToString(),
                                    Passed = Convert.ToBoolean(reader["Passed"]),
                                    Approved = Convert.ToBoolean(reader["Approved"]),
                                    Certified = Convert.ToInt32(reader["Certified"])
                                };
                                searchResults[userId].SearchContent.Materials.Add(material);
                            }
                            if (((List<TutorRate>)material.Pricing).Find(p => p.Id == priceId) == null)
                            {
                                material.Pricing.Add(new TutorRate
                                {
                                    Currency = Convert.ToInt32(reader["CurrenyId"]),
                                    Id = priceId,
                                    LessonType = Convert.ToInt64(reader["LessonType"]),
                                    MaterialId = sysId,
                                    Price = Convert.ToDecimal(reader["Price"]),
                                });
                            }

                            searchResults[userId].SearchContent.TaughtHours += Convert.ToInt32(reader["TaughtHours"]);
                        }
                    }
                }catch(Exception ex)
                {
                    return searchResults.Values;
                }
            }
            return searchResults.Values;
        }
    }
}