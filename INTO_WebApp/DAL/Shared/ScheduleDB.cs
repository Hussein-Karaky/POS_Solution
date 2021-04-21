using BLL.Shared;
using BLL.Shared.Auth;
using BLL.Shared.Collaboration;
using BLL.Shared.Notif;
using BLL.Shared.Struct;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using static BLL.Shared.Notif.Notification;

namespace DAL.Shared
{
    public class ScheduleDB
    {
        public static Availability Availability(long? id, byte? entityType, Availability avail, string conStr)
        {
            if (id.HasValue && entityType.HasValue && avail != null)
            {
                return SaveAvailability(id.Value, entityType.Value, avail, conStr);
            }
            return GetAvailability(id.Value, entityType.Value, conStr);
        }
        public static Availability SaveAvailability(long id, byte entityType, Availability avail, string conStr)
        {
            Availability availability = new Availability();
            if (avail != null)
            {
                using (SqlConnection connection = new SqlConnection(conStr))
                {
                    DataTable dtAvail = new DataTable();
                    dtAvail.Columns.Add("UId", typeof(long));
                    dtAvail.Columns.Add("ObjEntityId", typeof(byte));
                    dtAvail.Columns.Add("DayId", typeof(byte));
                    dtAvail.Columns.Add("FromTime", typeof(byte));
                    dtAvail.Columns.Add("ToTime", typeof(byte));
                    dtAvail.Columns.Add("PhoneCall", typeof(bool));
                    dtAvail.Columns.Add("OnlineSession", typeof(bool));
                    dtAvail.Columns.Add("FacetoFace", typeof(bool));
                    avail.Days.Where<AvailabilityDay>(d => d.Active).ToList().ForEach(d => d.Limits.ToList<TimeLimit>().ForEach(t =>
                    {
                        DataRow row = dtAvail.NewRow();
                        row["UId"] = id;
                        row["ObjEntityId"] = entityType;
                        row["DayId"] = d.Day.Index;
                        row["FromTime"] = t.From.Index;
                        row["ToTime"] = t.To.Index;
                        row["PhoneCall"] = t.Extra.PhoneCall;
                        row["OnlineSession"] = t.Extra.OnlineSession;
                        row["FacetoFace"] = t.Extra.FaceToFace;
                        dtAvail.Rows.Add(row);
                    }));
                    SqlCommand cmd = new SqlCommand("sp_ManageAvailability", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Avail",
                        TypeName = "udt_Availability",
                        SqlDbType = SqlDbType.Structured,
                        Value = dtAvail
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Mode",
                        SqlDbType = SqlDbType.VarChar,
                        Value = "Save"
                    });

                    connection.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            availability.Days.AsEnumerable<AvailabilityDay>().Where<AvailabilityDay>(d => d.Day.Index == reader.GetByte(2)).SingleOrDefault<AvailabilityDay>().Add(new TimeLimit { From = new TimePoint { Index = reader.GetByte(3), Value = TimePoint.Times[reader.GetByte(3)].Value }, To = new TimePoint { Index = reader.GetByte(4), Value = TimePoint.Times[reader.GetByte(4)].Value }, Extra = new TimeLimitExtra { PhoneCall = reader.GetBoolean(5), OnlineSession = reader.GetBoolean(6), FaceToFace = reader.GetBoolean(7) } });
                        }
                    }
                }
            }
            return availability;
        }

        public static Availability GetAvailability(long id, byte entityType, string conStr)
        {
            Availability availability = new Availability();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageAvailability", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@UId",
                    SqlDbType = SqlDbType.BigInt,
                    Value = id
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@ObjEntityId",
                    SqlDbType = SqlDbType.TinyInt,
                    Value = entityType
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
                        availability.Days.AsEnumerable<AvailabilityDay>().Where<AvailabilityDay>(d => d.Day.Index == reader.GetByte(2)).SingleOrDefault<AvailabilityDay>().Add(new TimeLimit { From = new TimePoint { Index = reader.GetByte(3), Value = TimePoint.Times[reader.GetByte(3)].Value }, To = new TimePoint { Index = reader.GetByte(4), Value = TimePoint.Times[reader.GetByte(4)].Value }, Extra = new TimeLimitExtra { PhoneCall = reader.GetBoolean(5), OnlineSession = reader.GetBoolean(6), FaceToFace = reader.GetBoolean(7) } });
                    }
                }
            }

            return availability;
        }

        public static ICollection<Event> SaveRoom(VirtualRoom room, int tzOffset, int lang = 1, string conStr = "")
        {
            if (room != null)
            {
                using (SqlConnection connection = new SqlConnection(conStr))
                {
                    DataTable dtParticipants = new DataTable();
                    if (room.Participants != null && room.Participants.Count > 0)
                    {
                        dtParticipants.Columns.Add("Id", typeof(long));
                        room.Participants.ToList().ForEach(p =>
                        {
                            DataRow row = dtParticipants.NewRow();
                            row["Id"] = p.UserId;
                            dtParticipants.Rows.Add(row);
                        });
                    }
                    SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Participants",
                        TypeName = "udt_BigIdList",
                        SqlDbType = SqlDbType.Structured,
                        Value = dtParticipants
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Mode",
                        SqlDbType = SqlDbType.VarChar,
                        Value = "Save"
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Title",
                        SqlDbType = SqlDbType.NVarChar,
                        Value = room.Title
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Host",
                        SqlDbType = SqlDbType.BigInt,
                        Value = room.Host
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@DueDate",
                        SqlDbType = SqlDbType.DateTime,
                        Value = room.DueDate
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@TimeZoneOffset",
                        SqlDbType = SqlDbType.DateTime,
                        Value = tzOffset
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Duration",
                        SqlDbType = SqlDbType.Int,
                        Value = room.Duration
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@MaterialId",
                        SqlDbType = SqlDbType.Int,
                        Value = room.Material.SysId
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@IsPaid",
                        SqlDbType = SqlDbType.Bit,
                        Value = room.Paid
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Active",
                        SqlDbType = SqlDbType.Bit,
                        Value = room.Active
                    });

                    cmd.Parameters.Add(new SqlParameter
                    {
                        ParameterName = "@Cancelled",
                        SqlDbType = SqlDbType.Bit,
                        Value = room.Cancelled
                    });

                    connection.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        IDictionary<long, Event> rooms = new Dictionary<long, Event>();
                        while (reader.Read())
                        {
                            long id = Convert.ToInt64(reader["Id"]);
                            if (!rooms.Keys.Contains(id))
                            {
                                Event rm = new VirtualRoom
                                {
                                    Id = id,
                                    RoomId = Convert.ToInt64(reader["RoomId"]),
                                    Title = reader["Title"].ToString(),
                                    Host = new User
                                    {
                                        UserId = Convert.ToInt64(reader["Host"]),
                                        FirstName = reader["FirstName"].ToString(),
                                        LastName = reader["LastName"].ToString(),
                                        Email = reader["Email"].ToString(),
                                        Gender = Convert.ToBoolean(reader["Gender"]),
                                        Role = new Role
                                        {
                                            Id = Convert.ToInt16(reader["HRoleId"]),
                                            Name = reader["HRoleName"].ToString(),
                                            Display = reader["HRoleDisplay"].ToString(),
                                            Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null
                                        }
                                    },
                                    DueDate = Convert.ToDateTime(reader["DueDate"]),
                                    Material = new Material(reader),
                                    Duration = Convert.ToInt32(reader["Duration"]),
                                    Active = Convert.ToBoolean(reader["Active"]),
                                    Cancelled = Convert.ToBoolean(reader["Cancelled"]),
                                    Running = Convert.ToBoolean(reader["Running"]),
                                    Paid = Convert.ToBoolean(reader["IsPaid"]),
                                    Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : null,
                                    Participants = new List<User>(),
                                    DateStarted = reader["DateStarted"] != DBNull.Value ? Convert.ToDateTime(reader["DateStarted"]) : default(DateTime?),
                                    DateEnded = reader["DateEnded"] != DBNull.Value ? Convert.ToDateTime(reader["DateEnded"]) : default(DateTime?)
                                };
                                if (reader["ParticipantId"] != DBNull.Value)
                                {
                                    rm.Participants.Add(new User
                                    {
                                        UserId = Convert.ToInt64(reader["ParticipantId"]),
                                        FirstName = reader["PFName"].ToString(),
                                        LastName = reader["PLName"].ToString(),
                                        Email = reader["PEmail"].ToString(),
                                        Gender = Convert.ToBoolean(reader["PGender"]),
                                        Role = new Role
                                        {
                                            Id = Convert.ToInt16(reader["PRoleId"]),
                                            Name = reader["PRoleName"].ToString(),
                                            Display = reader["PRoleDisplay"].ToString(),
                                            Description = null
                                        }
                                    });
                                }
                                rooms.Add(id, rm);
                            }
                        }
                        return rooms.Values;
                    }
                }
            }
            return new Event[0];
        }

        public static DataList<Event> ScheduledBy(long host, int tzOffset, int lang = 1, string conStr = "")
        {
            IDictionary<long, Event> rooms = new Dictionary<long, Event>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "get" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Host", Value = host });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        long id = Convert.ToInt64(reader["Id"]);
                        if (!rooms.Keys.Contains(id))
                        {
                            Event rm = new VirtualRoom
                            {
                                Id = id,
                                RoomId = Convert.ToInt64(reader["RoomId"]),
                                Title = reader["Title"].ToString(),
                                Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                                Host = new User
                                {
                                    UserId = Convert.ToInt64(reader["Host"]),
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString()
                                },
                                DueDate = Convert.ToDateTime(reader["DueDate"]),
                                Material = new Material(reader),
                                Duration = Convert.ToInt32(reader["Duration"]),
                                Active = Convert.ToBoolean(reader["Active"]),
                                Cancelled = Convert.ToBoolean(reader["Cancelled"]),
                                Paid = Convert.ToBoolean(reader["IsPaid"]),
                                Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : null,
                                DateStarted = reader["DateStarted"] != DBNull.Value ? Convert.ToDateTime(reader["DateStarted"]) : default(DateTime?),
                                DateEnded = reader["DateEnded"] != DBNull.Value ? Convert.ToDateTime(reader["DateEnded"]) : default(DateTime?)
                            };
                            rooms.Add(id, rm);
                        }
                    }
                }
                connection.Close();
            }
            return new DataList<Event>(rooms.Values);
        }

        public static DataList<Event> ScheduledTo(long participant, int tzOffset, int lang = 1, string conStr = "")
        {
            IDictionary<long, Event> rooms = new Dictionary<long, Event>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "get" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ParticipantId", Value = participant });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        long id = Convert.ToInt64(reader["Id"]);
                        if (!rooms.Keys.Contains(id))
                        {
                            Event rm = new VirtualRoom
                            {
                                Id = id,
                                RoomId = Convert.ToInt64(reader["RoomId"]),
                                Title = reader["Title"].ToString(),
                                Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : null,
                                Host = new User
                                {
                                    UserId = Convert.ToInt64(reader["Host"]),
                                    FirstName = reader["FirstName"].ToString(),
                                    LastName = reader["LastName"].ToString()
                                },
                                DueDate = Convert.ToDateTime(reader["DueDate"]),
                                Material = new Material(reader),
                                Duration = Convert.ToInt32(reader["Duration"]),
                                Active = Convert.ToBoolean(reader["Active"]),
                                Cancelled = Convert.ToBoolean(reader["Cancelled"]),
                                Paid = Convert.ToBoolean(reader["IsPaid"]),
                                Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : null,
                                DateStarted = reader["DateStarted"] != DBNull.Value ? Convert.ToDateTime(reader["DateStarted"]) : default(DateTime?),
                                DateEnded = reader["DateEnded"] != DBNull.Value ? Convert.ToDateTime(reader["DateEnded"]) : default(DateTime?)
                            };
                            rooms.Add(id, rm);
                        }
                    }
                }
                connection.Close();
            }
            return new DataList<Event>(rooms.Values);
        }

        public static int Join(long id, long participant, int tzOffset, int lang, string conStr)
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                try { 
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "join" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ParticipantId", Value = participant });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();
                return 1;
                }
                catch (Exception ex) {
                    int error = 0;
                    return int.TryParse(ex.Message, out error) ? error : 0;
                }
            }
        }

        public static bool Abandon(long id, long participant, byte rating, string feedback, int tzOffset, int lang, string conStr)
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "abandon" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ParticipantId", Value = participant });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Rating", Value = rating });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Feedback", Value = feedback });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();
                return rows > 0;
            }
        }

        public static bool Confirm(long id, long participant, int tzOffset, int lang, string conStr)
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "confirm" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ParticipantId", Value = participant });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();
                return rows > 0;
            }
        }

        public static bool Reject(long id, long participant, string excuse, int tzOffset, int lang, string conStr)
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "excuse" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ParticipantId", Value = participant });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Excuse", Value = excuse });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                connection.Open();
                int rows = cmd.ExecuteNonQuery();
                connection.Close();
                return rows > 0;
            }
        }

        public static DataList<Event> Room(long id, int tzOffset, int lang = 1, string conStr = "")
        {
            IDictionary<long, Event> events = new Dictionary<long, Event>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                try
                {
                    SqlCommand cmd = new SqlCommand("sp_ManageRooms", connection);
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "getFull" });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                    connection.Open();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            long eventId = Convert.ToInt64(reader["Id"]);
                            if (events.Keys.Contains(eventId) && reader["ParticipantId"] != DBNull.Value)
                            {
                                long userId = Convert.ToInt64(reader["ParticipantId"]);
                                events[eventId].Participants.Add(new User
                                {
                                    UserId = userId,
                                    FirstName = reader["PFirstName"] != DBNull.Value ? reader["PFirstName"].ToString() : null,
                                    LastName = reader["PLastName"] != DBNull.Value ? reader["PLastName"].ToString() : null,
                                    Email = reader["PEmail"] != DBNull.Value ? reader["PEmail"].ToString() : null,
                                    Online = Convert.ToBoolean(reader["Online"]),
                                    Phone = reader["PPhone"] != DBNull.Value ? reader["PPhone"].ToString() : null,
                                    Gender = Convert.ToBoolean(reader["PGender"]),
                                    MiniPic = reader["PMiniPicture"] != DBNull.Value ? reader["PMiniPicture"].ToString() : null,
                                    Role = new Role
                                    {
                                        Id = Convert.ToInt16(reader["PRoleId"]),
                                        Name = reader["PRName"] != DBNull.Value ? reader["PRName"].ToString() : null,
                                        Display = reader["PRDisplay"] != DBNull.Value ? reader["PRDisplay"].ToString() : null,
                                    }
                                });
                                if (Convert.ToBoolean(reader["Joined"]))
                                {
                                    events[eventId].Joined.Add(userId);
                                }
                            }
                            else
                            {
                                Event room = new VirtualRoom
                                {
                                    Id = eventId,
                                    RoomId = Convert.ToInt64(reader["RoomId"]),
                                    Title = reader["Title"].ToString(),
                                    Description = reader["Description"] != DBNull.Value ? reader["Description"].ToString() : "",
                                    Host = new User
                                    {
                                        UserId = Convert.ToInt64(reader["Host"])
                                    },
                                    DueDate = Convert.ToDateTime(reader["DueDate"]),
                                    Material = new Material(reader),
                                    UsesMathTools = Convert.ToBoolean(reader["UsesMathTools"]),
                                    Duration = Convert.ToInt32(reader["Duration"]),
                                    Active = Convert.ToBoolean(reader["Active"]),
                                    Running = Convert.ToBoolean(reader["Running"]),
                                    StartsWithoutHost = Convert.ToBoolean(reader["StartsWithoutHost"]),
                                    Cancelled = Convert.ToBoolean(reader["Cancelled"]),
                                    Paid = Convert.ToBoolean(reader["IsPaid"]),
                                    Password = reader["Password"] != DBNull.Value ? reader["Password"].ToString() : null,
                                    Participants = new List<User>(),
                                    Joined = new List<long>(),
                                    DateStarted = reader["DateStarted"] != DBNull.Value ? Convert.ToDateTime(reader["DateStarted"]) : default(DateTime?),
                                    DateEnded = reader["DateEnded"] != DBNull.Value ? Convert.ToDateTime(reader["DateEnded"]) : default(DateTime?)
                                };
                                if (reader["ParticipantId"] != DBNull.Value)
                                {
                                    long userId = Convert.ToInt64(reader["ParticipantId"]);
                                    room.Participants.Add(new User
                                    {
                                        UserId = userId,
                                        FirstName = reader["PFirstName"] != DBNull.Value ? reader["PFirstName"].ToString() : null,
                                        LastName = reader["PLastName"] != DBNull.Value ? reader["PLastName"].ToString() : null,
                                        Email = reader["PEmail"] != DBNull.Value ? reader["PEmail"].ToString() : null,
                                        Online = Convert.ToBoolean(reader["Online"]),
                                        Phone = reader["PPhone"] != DBNull.Value ? reader["PPhone"].ToString() : null,
                                        Gender = Convert.ToBoolean(reader["PGender"]),
                                        MiniPic = reader["PMiniPicture"] != DBNull.Value ? reader["PMiniPicture"].ToString() : null,
                                        Role = new Role
                                        {
                                            Id = Convert.ToInt16(reader["PRoleId"]),
                                            Name = reader["PRName"] != DBNull.Value ? reader["PRName"].ToString() : null,
                                            Display = reader["PRDisplay"] != DBNull.Value ? reader["PRDisplay"].ToString() : null,
                                        }
                                    });
                                    if (Convert.ToBoolean(reader["Joined"]))
                                    {
                                        room.Joined.Add(userId);
                                    }
                                }
                                events.Add(eventId, room);
                            }
                        }
                    }
                    connection.Close();
                }catch(Exception ex)
                {
                    Console.WriteLine(ex.Message);//dummy code
                }
            }
            return new DataList<Event>(events.Values);
        }
        public static QAResponse<ICollection<Notif>> GetNotificationsPage(long UID, NotificationType type, int tzOffset, DateTime? from = null, DateTime? to = null, int lang = 1, int pageNumber = 1, int pageSize = 1, string conStr = "", bool content = true)
        {
            QAResponse<ICollection<Notif>> response = new QAResponse<ICollection<Notif>>();
            IDictionary<string, Notif> notifs = new Dictionary<string, Notif>();
            int outp = 0;
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageNotification", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "readyToSendPagination" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Type", Value = (byte)type });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@FromDate", Value = from });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ToDate", Value = to });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@PageSize", Value = pageSize });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@PageNumber", Value = pageNumber });
                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@RemainingPages";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        long id = Convert.ToInt64(reader["Id"]);
                        int userLang = Convert.ToInt32(reader["LanguageId"]);
                        string key = string.Concat(id, '_', userLang);

                        Notif notif = new Notif
                        {
                            Id = id,
                            Title = reader["Title"].ToString(),
                            Content = content ? reader["Content"].ToString() : "",
                            Date = reader["StartDate"] != DBNull.Value ? Convert.ToDateTime(reader["StartDate"]) : default(DateTime?)
                        };
                        if (!notifs.Keys.Contains(key))
                        {
                            notifs.Add(key, notif);
                        }
                        else
                        {
                            notif = notifs[key];
                        }
                    }
                    reader.NextResult();
                }
                outp = Convert.ToInt32(cmd.Parameters["@RemainingPages"].Value);
                connection.Close();
            }
            response.Content = notifs.Values;
            response.Extras.Add("RemainingPages", outp.ToString());
            return response;
        }

        public static DataList<Notification> GetNotifications(NotificationType type, int tzOffset, DateTime? from = null, DateTime? to = null, int lang = 1, string conStr = "")
        {
            IDictionary<string, Notification> notifs = new Dictionary<string, Notification>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageNotification", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "readyToSend" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Type", Value = (byte)type });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@FromDate", Value = from });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ToDate", Value = to });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        long id = Convert.ToInt64(reader["Id"]);
                        int userLang = Convert.ToInt32(reader["LanguageId"]);
                        Notification notif = null;
                        string key = string.Concat(id, '_', userLang);
                        if (!notifs.Keys.Contains(key))
                        {
                            notif = Notification.Factories[(byte)type - 1].Create(id, reader);
                            notifs.Add(key, notif);
                        }
                        else
                        {
                            notif = notifs[key];
                        }
                        notif.Users.Add(new User(reader, "User"));
                    }
                }
                connection.Close();
            }
            return new DataList<Notification>(notifs.Values);
        }
        public static DataList<Notification> GetNotifications(long id, NotificationType type, int tzOffset, DateTime? from = null, DateTime? to = null, int lang = 1, byte limit = 5, string conStr = "")
        {
            IDictionary<long, Notification> notifs = new Dictionary<long, Notification>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageNotification", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "userNotifs" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UId", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Type", Value = (byte)type });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TimeZoneOffset", Value = tzOffset });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@FromDate", Value = from });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ToDate", Value = to });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = lang });
                connection.Open();
                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        long notifId = Convert.ToInt64(reader["Id"]);
                        Notification notif = null;
                        if (!notifs.Keys.Contains(notifId))
                        {
                            notif = Notification.Factories[(byte)type - 1].Create(notifId, reader);
                            notifs.Add(notifId, notif);
                        }
                        else
                        {
                            notif = notifs[notifId];
                        }
                        notif.Users.Add(new User(reader, "User"));
                    }
                }
                connection.Close();
            }
            return new DataList<Notification>(notifs.Values);
        }
        public static int UpdateNotifStatus(ICollection<NotificationResponse> responses, string connection = "")
        {
            int rows = 0;
            DataTable dt = new DataTable();
            dt.Columns.Add("NotificationId");
            dt.Columns.Add("UserId");
            dt.Columns.Add("Status");
            foreach (NotificationResponse response in responses)
            {
                var row = dt.NewRow();
                row["NotificationId"] = Convert.ToInt64(response.NotificationId);
                row["UserId"] = Convert.ToInt64(response.UserId);
                row["Status"] = Convert.ToByte(response.Status);

                dt.Rows.Add(row);
            }

            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Countries
                SqlCommand cmd = new SqlCommand("sp_ManageNotification", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "updateStatus"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@UserNotifStatus",
                    Value = dt
                });

                con.Open();
                rows = cmd.ExecuteNonQuery();
            }
            return rows;
        }
        public static int CreateNotification(Notification notification, int tzOffset, string connection = "")
        {
            int rows = 0;
            DataTable notifUsers = new DataTable();
            notifUsers.Columns.Add("Id", typeof(long));
            foreach (User user in notification.Users)
            {
                DataRow row = notifUsers.NewRow();
                row["Id"] = user.UserId;
                notifUsers.Rows.Add(row);
            }
            DataTable notifEntityTypes = new DataTable();
            notifEntityTypes.Columns.Add("Id", typeof(int));
            foreach (byte type in notification.EntityTypes)
            {
                DataRow row = notifEntityTypes.NewRow();
                row["Id"] = type;
                notifEntityTypes.Rows.Add(row);
            }

            using (SqlConnection con = new SqlConnection(connection))
            {
                //Getting Countries
                SqlCommand cmd = new SqlCommand("sp_ManageNotification", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Mode",
                    Value = "create"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TitleId",
                    Value = notification.TitleId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ContentId",
                    Value = notification.ContentId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Parameterized",
                    Value = notification.Parameterized
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Type",
                    Value = notification.ByteType
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Position",
                    Value = notification.Position
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@EventId",
                    Value = notification.EventId
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@EventType",
                    Value = notification.EventType
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@DueDate",
                    Value = notification.StartDate
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ExpiryDate",
                    Value = notification.ExpiryDate
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@TimeZoneOffset",
                    Value = tzOffset
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@Users",
                    TypeName = "udt_BigIdList",
                    SqlDbType = SqlDbType.Structured,
                    Value = notifUsers
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@EntityTypes",
                    TypeName = "udt_IdList",
                    SqlDbType = SqlDbType.Structured,
                    Value = notifEntityTypes
                });

                con.Open();
                rows = cmd.ExecuteNonQuery();
            }
            return rows;
        }

    }
}
