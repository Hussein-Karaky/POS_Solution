using BLL.Parent;
using BLL.School;
using BLL.Shared;
using BLL.Student;
using BLL.Tutor;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using static BLL.Shared.WeekDay;

namespace DAL.Shared
{
    public class ScheduleDB
    {
        public static bool SaveAvailability(Availability avail, string conStr)
        {
            if (avail != null)
            {
                using (SqlConnection connection = new SqlConnection(conStr))
                {
                    User curUser = User.CurrentUser;
                    //long subId = -1;
                    //switch (curUser.Type)
                    //{
                    //    case EntityType.Tutor:
                    //        subId = ((TutorProfile)curUser).Id;
                    //        break;
                    //    case EntityType.Student:
                    //        subId = ((Student)curUser).Id;
                    //        break;
                    //    case EntityType.Parent:
                    //        subId = ((Parent)curUser).Id;
                    //        break;
                    //    case EntityType.School:
                    //        subId = ((School)curUser).Id;
                    //        break;
                    //}
                    DataTable availability = new DataTable();// "Availability");
                    availability.Columns.Add("UId", typeof(long));
                    availability.Columns.Add("ObjEntityId", typeof(byte));
                    availability.Columns.Add("DayId", typeof(byte));
                    availability.Columns.Add("FromTime", typeof(byte));
                    availability.Columns.Add("ToTime", typeof(byte));
                    availability.Columns.Add("PhoneCall", typeof(bool));
                    availability.Columns.Add("OnlineSession", typeof(bool));
                    availability.Columns.Add("FacetoFace", typeof(bool));
                    avail.Days.Where<AvailabilityDay>(d => d.Active).ToList().ForEach(d => d.Limits.ToList<TimeLimit>().ForEach(t => {
                        DataRow row = availability.NewRow();
                        row["UId"] = curUser.UserId;
                        row["ObjEntityId"] = (byte)curUser.Type;
                        row["DayId"] = d.Day.Index;
                        row["FromTime"] = t.From.Index;
                        row["ToTime"] = t.To.Index;
                        row["PhoneCall"] = t.Extra.PhoneCall;
                        row["OnlineSession"] = t.Extra.OnlineSession;
                        row["FacetoFace"] = t.Extra.FaceToFace;
                        availability.Rows.Add(row);
                    }));
                    SqlCommand cmd = new SqlCommand("sp_ManageAvailability", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Avail",
                        TypeName = "Availability",
                        SqlDbType = SqlDbType.Structured,
                        Value = availability
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Mode",
                        SqlDbType = SqlDbType.VarChar,
                        Value = "Save"
                    });

                    connection.Open();
                    var r = cmd.ExecuteNonQuery();
                    return true;
                }
            }
            return false;
        }

        public static Availability GetAvailability(string conStr)
        {
            Availability avail = new Availability();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                User curUser = User.CurrentUser;
                //long subId = -1;
                //switch (curUser.Type)
                //{
                //    case EntityType.Tutor:
                //        subId = ((TutorProfile)curUser).Id;
                //        break;
                //    case EntityType.Student:
                //        subId = ((Student)curUser).Id;
                //        break;
                //    case EntityType.Parent:
                //        subId = ((Parent)curUser).Id;
                //        break;
                //    case EntityType.School:
                //        subId = ((School)curUser).Id;
                //        break;
                //}

                SqlCommand cmd = new SqlCommand("sp_ManageAvailability", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@UId",
                    SqlDbType = SqlDbType.BigInt,
                    Value = curUser.UserId
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@ObjEntityId",
                    SqlDbType = SqlDbType.TinyInt,
                    Value = (byte)curUser.Type
                }); ;

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    SqlDbType = SqlDbType.VarChar,
                    Value = "GetAvailability"
                });

                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        avail.Days.AsEnumerable<AvailabilityDay>().Where<AvailabilityDay>(d => d.Day.Index == reader.GetByte(2)).SingleOrDefault<AvailabilityDay>().Add(new TimeLimit { From = new TimePoint { Index = reader.GetByte(3), Value = TimePoint.Times[reader.GetByte(3)].Value }, To = new TimePoint { Index = reader.GetByte(4), Value = TimePoint.Times[reader.GetByte(4)].Value }, Extra = new TimeLimitExtra { PhoneCall = reader.GetBoolean(5), OnlineSession = reader.GetBoolean(6), FaceToFace = reader.GetBoolean(7) } });
                    }
                }
            }

            return avail;
        }
    }
}
