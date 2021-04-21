using BLL.Shared;
using BLL.Shared.Notif;
using BLL.Shared.Struct;
using BLL.Student;
using DAL.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using ParentType = BLL.Parent.Parent;
using SchoolType = BLL.School.School;
using StudentType = BLL.Student.Student;
using TutorType = BLL.Tutor.Tutor;

namespace DAL.Shared
{
    public class UserDB
    {
        public static bool Logout(long id, int lang = 1, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "logout" });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    return rows > 0;
                }
                catch (Exception ex) {
                    return false;
                }
            }
        }
        public static User Login(EntityType type, string email = "", string password = "", int tzOs = 0, string conStr = "")
        {
            User user = null;
            switch (type)
            {
                case EntityType.Tutor:
                    user = TutorLogin(email, password, tzOs, conStr);
                    break;
                case EntityType.Student:
                    user = StudentLogin(email, password, tzOs, conStr);
                    break;
                case EntityType.Parent:
                    user = ParentLogin(email, password, tzOs, conStr);
                    break;
                case EntityType.School:
                    user = SchoolLogin(email, password, tzOs, conStr);
                    break;
            }
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "CheckLogin" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Email", Value = email });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Password", Value = password });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOs });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    //jinan
                    rdr.Read();
                    if (rdr["EntityType"] != DBNull.Value)
                    {
                        byte entityType = Convert.ToByte(rdr["EntityType"]);
                        type = (EntityType)entityType;
                        switch (type)
                        {
                            case EntityType.Tutor:
                                user = new TutorType(rdr);
                                break;
                            case EntityType.Student:
                                user = new StudentType(rdr);
                                break;
                            case EntityType.Parent:
                                //user = ParentLogin(email, password, conStr);
                                break;
                            case EntityType.School:
                                //user = SchoolLogin(email, password, conStr);
                                break;
                        }

                    }
                }
            }
            return user;
        }
        public static TutorType TutorLogin(string email = "", string password = "", int tzOs = 0, string conStr = "")
        {
            TutorType tutor = null;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "CheckLogin" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Email", Value = email });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Password", Value = password });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOs });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {

                    while (rdr.Read())
                    {
                        tutor = new TutorType(rdr);
                    }
                }
                con.Close();
            }
            return tutor;
        }

        //StudentLogin jinan
        public static StudentType StudentLogin(string email = "", string password = "", int tzOs = 0, string conStr = "")
        {
            StudentType student = null;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "Login" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Email", Value = email });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Password", Value = password });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = 2 });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOs });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {

                    while (rdr.Read())
                    {
                        student = new StudentType(rdr);
                    }
                }
                con.Close();
            }
            return student;
        }
        public static ParentType ParentLogin(string email = "", string password = "", int tzOs = 0, string conStr = "")
        {
            ParentType parent = new ParentType();

            return parent;
        }
        public static SchoolType SchoolLogin(string email = "", string password = "", int tzOs = 0, string conStr = "")
        {
            SchoolType school = new SchoolType();

            return school;
        }
        public static string UpdatePicture(string picture = null, string miniPicture = null, long userId = 0, string conStr = "")
        {
            string profilePic = picture;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Picture"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Picture",
                    Value = picture
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@MiniPicture",
                    Value = miniPicture
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        profilePic = rdr["ProfilePicture"].ToString();
                    }
                }
            }
            return profilePic;
        }
        public static bool UpdateLang(long userId, int lang = 1, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Lang"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = lang
                });

                con.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
            return false;
        }

        public static DataList<DataObject> Like(long userId, long objId, byte objType, bool? like = null, int lang = 1, string conStr = "")
        {
            ICollection <DataObject> list = new List<DataObject>();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUserAction", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Like"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UserId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjId",
                    Value = objId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjType",
                    Value = objType
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Liked",
                    Value = like
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        list.Add(new DataObject(rdr));
                    }
                }
            }
            return new DataList<DataObject>(list);
        }
        public static DataList<DataObject> Rate(long userId, long objId, byte objType, decimal? value = null, int lang = 1, string conStr = "")
        {
            ICollection<DataObject> list = new List<DataObject>();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUserAction", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Rate"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UserId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjId",
                    Value = objId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjType",
                    Value = objType
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Rating",
                    Value = value
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        list.Add(new DataObject(rdr));
                    }
                }
            }
            return new DataList<DataObject>(list);
        }
        public static DataList<DataObject> Review(long userId, long objId, byte objType, string review = null, int lang = 1, string conStr = "")
        {
            ICollection<DataObject> list = new List<DataObject>();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUserAction", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Review"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UserId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjId",
                    Value = objId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjType",
                    Value = objType
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Review",
                    Value = review
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        list.Add(new DataObject(rdr));
                    }
                }
            }
            return new DataList<DataObject>(list);
        }
        public static DataList<DataObject> Ratings(long userId, long objId, byte objType, int lang = 1, string conStr = "")
        {
            ICollection<DataObject> list = new List<DataObject>();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUserAction", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Get"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UserId",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjId",
                    Value = objId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjType",
                    Value = objType
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        list.Add(new DataObject(rdr));
                    }
                }
            }
            return new DataList<DataObject>(list);
        }
        public static bool Friend(long requester, long requestee, int lang = 1, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFriendship", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Request"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Requester",
                    Value = requester
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Requestee",
                    Value = requestee
                });

                con.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows > 0;
            }
        }
        public static object SaveBasicInfo(string dob, bool gender, long id, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "BasicInfo"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                DateTime doB = DateTime.Parse(dob);
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@DoB",
                    Value = doB
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Gender",
                    Value = gender
                });

                con.Open();
                int rows = cmd.ExecuteNonQuery();
                return rows;
            }
        }

        public static LocationSettings UpdateLocation(int countryId, string city, string address, string address2, decimal? privacyRadius, decimal? travelRadius, decimal? lat, decimal? lng, long userId = 0, string conStr = "")
        {
            LocationSettings locationSettings = null;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageUsers", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Location"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = userId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CountryId",
                    Value = countryId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@City",
                    Value = city
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Address",
                    Value = address
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Address2",
                    Value = address2
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@PrivacyRadius",
                    Value = privacyRadius
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TravelRadius",
                    Value = travelRadius
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Latitude",
                    Value = lat
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Longitude",
                    Value = lng
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        locationSettings = new LocationSettings(rdr);
                    }
                }
            }
            return locationSettings;
        }

        //To be discussed !! (What to return)
        public static TutorType UserSignUp_(string firstName = "", string lastName = "", string email = "", string password = "", int tzOs = 0, int countryId = 0, string conStr = "")
        {
            TutorType us = new TutorType();
            us = null;

            using (SqlConnection con = new SqlConnection(conStr))
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
                    Value = firstName
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LastName",
                    Value = lastName
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Email",
                    Value = email
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Password",
                    Value = password
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CountryId",
                    Value = countryId
                });
                //@ObjName
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ObjName",
                    Value = "Tutor"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = 1
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Active",
                    Value = 0
                });
                try
                {
                    con.Open();
                    cmd.ExecuteNonQuery();
                    con.Close();
                    us = TutorLogin(email, password, tzOs, conStr);
                    return us;

                }
                catch (Exception)
                {
                    return us;
                }
            }
        }
        //To be discussed !! (What to return)
        public static TutorType UserSignUp(User user, string actUrl, string conStr = "")
        {
            TutorType tutor = null;
            const int MAXIMUM_PASSWORD_ATTEMPTS = 10000;
            bool includeLowercase = true;
            bool includeUppercase = true;
            bool includeNumeric = true;
            bool includeSpecial = false;
            int lengthOfPassword = 16;

            PasswordGeneratorSettings settings = new PasswordGeneratorSettings(includeLowercase, includeUppercase, includeNumeric, includeSpecial, lengthOfPassword);
            string password;
            if (!settings.IsValidLength())
            {
                password = settings.LengthErrorMessage();
            }
            else
            {
                int passwordAttempts = 0;
                do
                {
                    password = PasswordGenerator.GeneratePassword(settings);
                    passwordAttempts++;
                }
                while (passwordAttempts < MAXIMUM_PASSWORD_ATTEMPTS && !PasswordGenerator.PasswordIsValid(settings, password));

                password = PasswordGenerator.PasswordIsValid(settings, password) ? password : "Try again";
            }
            user.ActivationCode = password;

            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "Insert"
                    });

                    cmd.Parameters.Add("@FirstName", SqlDbType.VarChar).Value = user.FirstName;
                    cmd.Parameters.Add("@LastName", SqlDbType.VarChar).Value = user.LastName;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = user.Email;
                    cmd.Parameters.Add("@Password", SqlDbType.VarChar).Value = user.Password;
                    cmd.Parameters.Add("@ActivationCode", SqlDbType.VarChar).Value = user.ActivationCode;
                    cmd.Parameters.Add("@CountryId", SqlDbType.Int).Value = user.LocationSettings.Country.Id;
                    cmd.Parameters.Add("@ObjEntityId", SqlDbType.Int).Value = (Byte)user.Type;
                    cmd.Parameters.Add("@TimeZoneOffset", SqlDbType.Int).Value = user.TimezoneOffset;

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                    bool success = false;
                    if (rows > 0)
                    {
                        //TODO: Notify SecondaryEmail first if any.
                        string htmlString = "<html><body><h1>Dear " + user.FirstName + ",</h1><br/>" +
                            "<h6>Please click on the link below to activate your account:</h6><br/><br/>" +
                            "<a href=\"" + actUrl + "/" + user.UserId + "/" + user.ActivationCode + "\">Activate</a></body></html>";
                        success = new EmailNotifier
                        {
                            From = "into.devteam@gmail.com",//TODO: Read from DB
                            Password = "Into@1234",//TODO: Read from DB
                            To = new string[] { user.Email },
                            Subject = "INTO Account",
                            Body = htmlString,
                            IsBodyHtml = true,
                            SmtpServer = "smtp.gmail.com",
                            SmtpPort = 587,
                            IsSSL = true
                        }.Notify();
                    }
                    if (success)
                    {
                        tutor = new TutorType { FirstName = user.FirstName, LastName = user.LastName, Active = false, LocationSettings = user.LocationSettings, Phone = user.Phone, Email = user.Email, Password = user.Password };
                    }
                }
                return tutor;
            }
        }

        public static User ActivateUser(long userId, string actCode, string conStr = "")
        {
            User user = new User();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "Activate"
                    });

                    cmd.Parameters.Add("@ActivationCode", SqlDbType.VarChar).Value = actCode;
                    cmd.Parameters.Add("@ID", SqlDbType.VarChar).Value = userId;

                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            user = new User(rdr);
                        }
                    }
                    con.Close();
                }
            }

            return user;
        }
        public static User ResetPassword(string email, string actUrl, string conStr = "")
        {
            const int MAXIMUM_PASSWORD_ATTEMPTS = 10000;
            bool includeLowercase = true;
            bool includeUppercase = true;
            bool includeNumeric = true;
            bool includeSpecial = false;
            int lengthOfPassword = 16;

            PasswordGeneratorSettings settings = new PasswordGeneratorSettings(includeLowercase, includeUppercase, includeNumeric, includeSpecial, lengthOfPassword);
            string password;
            if (!settings.IsValidLength())
            {
                password = settings.LengthErrorMessage();
            }
            else
            {
                int passwordAttempts = 0;
                do
                {
                    password = PasswordGenerator.GeneratePassword(settings);
                    passwordAttempts++;
                }
                while (passwordAttempts < MAXIMUM_PASSWORD_ATTEMPTS && !PasswordGenerator.PasswordIsValid(settings, password));

                password = PasswordGenerator.PasswordIsValid(settings, password) ? password : "Try again";
            }
            User user = new User { Email = email, ActivationCode = password };
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "PreparePwdReset"
                    });
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = user.Email;
                    cmd.Parameters.Add("@ActivationCode", SqlDbType.VarChar).Value = user.ActivationCode;

                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    bool success = false;
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            user = new User(rdr);
                        }
                        //TODO: Notify SecondaryEmail first if any.
                        string htmlString = "<html><body><h1>Dear " + user.FirstName + ",</h1><br/>" +
                            "<h6>Please click on the link below and follow the procedure to reset your password:</h6><br/><br/>" +
                            "<a href=\"" + actUrl + "/" + user.UserId + "?rcode=" + user.ActivationCode + "\">Reset Password</a></body></html>";
                        success = new EmailNotifier
                        {
                            From = "into.devteam@gmail.com",
                            Password = "INT01234",
                            To = new string[] { user.Email },
                            Subject = "INTO Login Infos",
                            Body = htmlString,
                            IsBodyHtml = true,
                            SmtpServer = "smtp.gmail.com",
                            SmtpPort = 587,
                            IsSSL = true
                        }.Notify();
                    }
                    if (success)
                    {
                        return user;
                    }
                }
            }
            return user;
        }
        public static User ResetPassword(User user, string conStr = "")
        {
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "PwdReset"
                    });

                    cmd.Parameters.Add("@ActivationCode", SqlDbType.VarChar).Value = user.ActivationCode;
                    cmd.Parameters.Add("@ID", SqlDbType.VarChar).Value = user.UserId;
                    cmd.Parameters.Add("@Password", SqlDbType.VarChar).Value = user.Password;

                    con.Open();
                    SqlDataReader rdr = cmd.ExecuteReader();
                    if (rdr.HasRows)
                    {
                        while (rdr.Read())
                        {
                            user = new User(rdr);
                        }
                    }
                    con.Close();
                }
            }

            return user;
        }
        public static Registration UserNameExists(string Email = "", string connection = "")
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
        public static bool CheckIfEmailExist(string Email, string connection = "")
        {
            bool emailExist = false;

            using (SqlConnection con = new SqlConnection(connection))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "CheckUserName"
                    });
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = Email;

                    con.Open();
                    emailExist = Convert.ToBoolean(cmd.ExecuteScalar());
                }
                return emailExist;
            }
        }
        public static User GetUser(long? userId = null, int? langId = 1, string conStr = "")
        {
            User user = new User();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageUsers", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "ViewByID"
                    });
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@ID",
                        Value = userId
                    });
                    //cmd.Parameters.Add(new SqlParameter()
                    //{
                    //    ParameterName = "@LanguageId",
                    //    Value = langId
                    //});

                    con.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            user.UserId = Convert.ToInt32(reader["Id"]);
                            user.FirstName = reader["FirstName"].ToString();
                            user.LastName = reader["LastName"].ToString();
                            user.Email = reader["Email"].ToString();
                            user.Phone = reader["Phone"].ToString();
                        }
                    }
                }
            }
            return user;
        }

        //jinan
        public static Student EditStudentProfile(Student student, int countryId, string address, string address2, string city, string conStr = "")
        {
            Student ss = new Student();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageStudent", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "EditProfile"
                    });
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@UId",
                        Value = student.UserId
                    });

                    cmd.Parameters.Add("@DOB", SqlDbType.Date).Value = student.DOB;
                    cmd.Parameters.Add("@SchoolName", SqlDbType.VarChar).Value = student.SchoolName;
                    cmd.Parameters.Add("@SchoolYear", SqlDbType.Int).Value = student.SchoolYear;
                    cmd.Parameters.Add("@CountryId", SqlDbType.Int).Value = countryId;
                    cmd.Parameters.Add("@Address", SqlDbType.VarChar).Value = address;
                    cmd.Parameters.Add("@Address2", SqlDbType.VarChar).Value = address2;
                    cmd.Parameters.Add("@City", SqlDbType.VarChar).Value = city;

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                }
                return ss;
            }
        }
        //jinan
        public static Student EditStudentPassword(Student student, string conStr = "")
        {
            Student std = new Student();
            using (SqlConnection con = new SqlConnection(conStr))
            {
                using (SqlCommand cmd = new SqlCommand("sp_ManageStudent", con))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@Mode",
                        Value = "EditPassword"
                    });
                    cmd.Parameters.Add(new SqlParameter()
                    {
                        ParameterName = "@UId",
                        Value = student.UserId
                    });

                    cmd.Parameters.Add("@Password", SqlDbType.VarChar).Value = student.Password;

                    con.Open();
                    int rows = cmd.ExecuteNonQuery();
                }
                return std;
            }
        }
        //jinan
        public static bool InviteUserFriend(string FriendEmail, string conStr = "")
    {
        bool success = false;
        //TODO: Notify SecondaryEmail first if any.
        string htmlString = "<html><body><h3>Your friend sent you £10 off your first lesson</h3><br/>" +
            "<h4>Just follow this link and we’ll credit your MyTutor account www.mytutor.co.uk/signup.html?rc=MYTUTOR." +
            "Your credit will expire 30 days after sign-up so don't hesitate.</h4><br/><br/></body></html>";
        success = new EmailNotifier
        {
            From = "into.devteam@gmail.com",
            Password = "INT01234",
            To = new string[] { FriendEmail },
            Subject = "INTO Login Infos",
            Body = htmlString,
            IsBodyHtml = true,
            SmtpServer = "smtp.gmail.com",
            SmtpPort = 587,
            IsSSL = true
        }.Notify();
        return true;
    }
        public static string Ambition(long id, string ambition = null, string conStr = "")
        {
            string stdAmbition = ambition;
            using (SqlConnection con = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageStudent", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "Ambition"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Id",
                    Value = id
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Ambition",
                    Value = ambition
                });

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.HasRows)
                {
                    while (rdr.Read())
                    {
                        stdAmbition = rdr["Ambition"].ToString();
                    }
                }
            }
            return stdAmbition;
        }

    }
}
