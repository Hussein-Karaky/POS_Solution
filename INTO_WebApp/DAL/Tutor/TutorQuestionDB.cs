using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using BLL.Tutor.TutorQuestion;
using BLL.Shared;
using BLL;
using Newtonsoft.Json;

namespace DAL.Tutor
{
    public class TutorQuestionDB
    {
        public static IList<List<TutorQuestion>> GetTutorQuestions(string connection = "")
        {
            IList<List<TutorQuestion>> all = new List<List<TutorQuestion>>();
            IList<TutorQuestion> questionAnswered = new List<TutorQuestion>();
            IList<TutorQuestion> questionAdded = new List<TutorQuestion>();
            IList<TutorQuestion> questionFollowed = new List<TutorQuestion>();
            DataTable dt = new DataTable();
            DataTable dtTags = new DataTable();
            DataTable dtComments = new DataTable();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmdTags = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdTags.CommandType = CommandType.StoredProcedure;
                cmdTags.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTags" });

                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetTutorQuestionsWithCount" });

                SqlCommand cmdComments = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdComments.CommandType = CommandType.StoredProcedure;
                cmdComments.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllComments" });

                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(dt);

                SqlDataAdapter daTags = new SqlDataAdapter(cmdTags);
                daTags.Fill(dtTags);

                SqlDataAdapter daComments = new SqlDataAdapter(cmdComments);
                daComments.Fill(dtComments);
                con.Open();

                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    TutorQuestion tq = new TutorQuestion();
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                    // bring the tags that are related to question tq.id
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                    // bring the comments that are related to question tq.id
                    tq.tQuestionComments = GetCommentsByQuestionId(dtComments, tq.Id);
                    questionAdded.Add(tq);
                }
                all.Add(new List<TutorQuestion>(questionAdded));
                return all;
            }
        }
        public static IList<TutorQuestion> GetQuestionAnswered(DataTable dt = null, bool Answered = false, long TutorID = -1)
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                if (TutorID == -1)
                {
                    return dt.AsEnumerable().Where(r => bool.Parse(r["Answered"].ToString()) == Answered).Select(f => new TutorQuestion { Id = Convert.ToInt32(f["ID"]), Title = f["Title"].ToString(), Description = f["Description"].ToString(), Answered = Convert.ToBoolean(f["Answered"]), Followed = Convert.ToBoolean(f["Followed"]), FollowsNumber = Convert.ToInt32(f["FollowsNumber"]), TutorId = Convert.ToInt64(f["TutorId"]), AnswersNumber = Convert.ToInt32(f["AnswersNumber"]) }).ToList<TutorQuestion>();
                }
                return dt.AsEnumerable()
                    .Where(r => bool.Parse(r["Answered"].ToString()) == Answered)
                    .Where(r => long.Parse(r["TutorId"].ToString()) == TutorID)
                    .Select(f => new TutorQuestion { Id = Convert.ToInt32(f["ID"]), Title = f["Title"].ToString(), Description = f["Description"].ToString(), Answered = Convert.ToBoolean(f["Answered"]), Followed = Convert.ToBoolean(f["Followed"]), FollowsNumber = Convert.ToInt32(f["FollowsNumber"]), TutorId = Convert.ToInt64(f["TutorId"]), AnswersNumber = Convert.ToInt32(f["AnswersNumber"]) }).ToList<TutorQuestion>();
            }
            return new List<TutorQuestion>();
        }
        public static IList<TutorQuestion> GetQuestionFollowed(DataTable dt = null, bool Followed = false, long TutorID = -1)
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                if (TutorID == -1)
                {
                    return dt.AsEnumerable().Where(r => bool.Parse(r["Followed"].ToString()) == Followed).Select(f => new TutorQuestion { Id = Convert.ToInt32(f["ID"]), Title = f["Title"].ToString(), Description = f["Description"].ToString(), TutorId = Convert.ToInt64(f["TutorId"]), Answered = Convert.ToBoolean(f["Answered"]), Followed = Convert.ToBoolean(f["Followed"]), FollowsNumber = Convert.ToInt32(f["FollowsNumber"]), AnswersNumber = Convert.ToInt32(f["AnswersNumber"]) }).ToList<TutorQuestion>();
                }
                return dt.AsEnumerable()
                    .Where(r => bool.Parse(r["Followed"].ToString()) == Followed)
                    .Where(r => long.Parse(r["TutorId"].ToString()) == TutorID)
                    .Select(f => new TutorQuestion { Id = Convert.ToInt32(f["ID"]), Title = f["Title"].ToString(), Description = f["Description"].ToString(), TutorId = Convert.ToInt64(f["TutorId"]), Answered = Convert.ToBoolean(f["Answered"]), Followed = Convert.ToBoolean(f["Followed"]), FollowsNumber = Convert.ToInt32(f["FollowsNumber"]), AnswersNumber = Convert.ToInt32(f["AnswersNumber"]) }).ToList<TutorQuestion>();
            }
            return new List<TutorQuestion>();
        }
        public static IList<Tags> GetTagsByTutorQuestionId(DataTable dtTags = null, long TQuestionId = 0)
        {
            if (dtTags != null && dtTags.Rows.Count > 0)
                return dtTags.AsEnumerable().Where(r => int.Parse(r["TQuestionId"].ToString()) == TQuestionId).Select(f => new Tags { Id = Convert.ToInt32(f["ID"]), Name = f["Name"].ToString(), TQuestionId = Convert.ToInt32(f["TQuestionId"]) }).ToList<Tags>();
            return new List<Tags>();
        }
        public static IList<TQuestionAnswer> GetQuestionAnswers(DataTable dtAnswers = null)
        {
            if (dtAnswers != null && dtAnswers.Rows.Count > 0)
                return dtAnswers.AsEnumerable().Select(f => new TQuestionAnswer { Id = Convert.ToInt32(f["ID"]), TQuestionId = Convert.ToInt32(f["TQuestionId"]), Description = f["Description"].ToString(), PostTime = Convert.ToDateTime(f["PostTime"]), Status = Convert.ToBoolean(f["Status"]), UID = Convert.ToInt32(f["UID"]), ObjEntityId = Convert.ToInt32(f["ObjEntityId"]), AnswerCommentsNumber = Convert.ToInt32(f["AnswerCommentsNumber"]) }).ToList<TQuestionAnswer>();
            return new List<TQuestionAnswer>();
        }
        public static IList<TQuestionComment> GetCommentsByQuestionId(DataTable dtComments = null, long TQuestionId = 0)
        {
            if (dtComments != null && dtComments.Rows.Count > 0)
                return dtComments.AsEnumerable().Where(r => int.Parse(r["TQuestionId"].ToString()) == TQuestionId).Select(f => new TQuestionComment { Id = Convert.ToInt32(f["ID"]), Description = f["Description"].ToString(), TQuestionId = Convert.ToInt32(f["TQuestionId"]), UID = Convert.ToInt32(f["UID"]), ObjEntityId = Convert.ToInt32(f["ObjEntityId"]), CommentTime = Convert.ToDateTime(f["CommentTime"]) }).ToList<TQuestionComment>();
            return new List<TQuestionComment>();
        }
        public static IList<TQuestionAnswerComment> GetAnswerCommentsByAnswerId(DataTable dtAnswerComments = null, long TQuestionAnswerId = 0)
        {
            if (dtAnswerComments != null && dtAnswerComments.Rows.Count > 0)
                return dtAnswerComments.AsEnumerable().Where(r => int.Parse(r["TutorQuestionAnswerId"].ToString()) == TQuestionAnswerId).Select(f => new TQuestionAnswerComment { Id = Convert.ToInt32(f["ID"]), Description = f["Description"].ToString(), TQuestionAnswerId = Convert.ToInt32(f["TutorQuestionAnswerId"]), UID = Convert.ToInt32(f["UID"]), ObjEntityId = Convert.ToInt32(f["ObjEntityId"]), CommentTime = Convert.ToDateTime(f["CommentTime"]) }).ToList<TQuestionAnswerComment>();
            return new List<TQuestionAnswerComment>();
        }
        public static IList<TQuestionComment> GetQuestionComments(DataTable dtComments = null)
        {
            if (dtComments != null && dtComments.Rows.Count > 0)
                return dtComments.AsEnumerable().Select(f => new TQuestionComment { Id = Convert.ToInt32(f["ID"]), Description = f["Description"].ToString(), TQuestionId = Convert.ToInt32(f["TQuestionId"]), UID = Convert.ToInt32(f["UID"]), ObjEntityId = Convert.ToInt32(f["ObjEntityId"]), CommentTime = Convert.ToDateTime(f["CommentTime"]) }).ToList<TQuestionComment>();
            return new List<TQuestionComment>();
        }
        public static IList<TutorQuestion> GetCommentsForList(IList<TutorQuestion> tList, DataTable dtComments)
        {
            IList<TutorQuestion> t = new List<TutorQuestion>();
            t = tList;
            foreach (TutorQuestion item in t) // Loop through List with foreach
            {
                item.tQuestionComments = GetCommentsByQuestionId(dtComments, item.Id);
            }
            return t;
        }
        public static IList<TQuestionAnswer> GetAnswerCommentsForList(IList<TQuestionAnswer> tList, DataTable dtAnswerComments)
        {
            IList<TQuestionAnswer> t = new List<TQuestionAnswer>();
            t = tList;
            foreach (TQuestionAnswer item in t) // Loop through List with foreach
            {
                item.tAnswerComments = GetAnswerCommentsByAnswerId(dtAnswerComments, item.Id);
            }
            return t;
        }
        public static IList<TutorQuestion> GetTagsForList(IList<TutorQuestion> tList, DataTable dtTags)
        {
            IList<TutorQuestion> t = new List<TutorQuestion>();
            t = tList;
            foreach (TutorQuestion item in t) // Loop through List with foreach
            {
                item.tags = GetTagsByTutorQuestionId(dtTags, item.Id);
            }
            return t;
        }
        public static int SubmitTutorQuestion(string Title, string Description = "", long TutorId = 0, DataTable dtTags = null, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestion" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Title", Value = Title });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Description", Value = Description });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = TutorId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TagNames", Value = dtTags });
                // status =1 to be an opened question not closed (to be seen by all users)
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Status", Value = 1 });
                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@ID";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                con.Open();
                cmd.ExecuteNonQuery();
                return Convert.ToInt32(cmd.Parameters["@ID"].Value);
            }
        }
        public static TutorQuestion GetQuestionById(long TutorId = 0, long TQuestionId = 0, string connection = "")
        {
            TutorQuestion tq = new TutorQuestion();
            DataTable dtTags = new DataTable();
            DataTable dtAnswers = new DataTable();
            DataTable dtComments = new DataTable();
            DataTable dtAnswerComments = new DataTable();
            tq.TutorId = TutorId;
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetQuestionById" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = TutorId });
                SqlCommand cmdTags = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdTags.CommandType = CommandType.StoredProcedure;
                cmdTags.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTags" });
                SqlCommand cmdAnswerComments = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdAnswerComments.CommandType = CommandType.StoredProcedure;
                cmdAnswerComments.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllAnswerComments" });
                SqlCommand cmdAnswers = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdAnswers.CommandType = CommandType.StoredProcedure;
                cmdAnswers.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAnswersByQuestionId" });
                cmdAnswers.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                SqlCommand cmdComments = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdComments.CommandType = CommandType.StoredProcedure;
                cmdComments.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetCommentsByQuestionId" });
                cmdComments.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                SqlDataAdapter daTags = new SqlDataAdapter(cmdTags);
                daTags.Fill(dtTags);
                SqlDataAdapter daAnswers = new SqlDataAdapter(cmdAnswers);
                daAnswers.Fill(dtAnswers);
                SqlDataAdapter daComments = new SqlDataAdapter(cmdComments);
                daComments.Fill(dtComments);
                SqlDataAdapter daAnswerComments = new SqlDataAdapter(cmdAnswerComments);
                daAnswerComments.Fill(dtAnswerComments);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.CommentsNumber = Convert.ToInt32(rdr["CommentsNumber"]);
                    tq.tQuestionAnswers = GetQuestionAnswers(dtAnswers);
                    tq.tQuestionComments = GetQuestionComments(dtComments);
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                }
                tq.tQuestionAnswers = GetAnswerCommentsForList(tq.tQuestionAnswers ?? new List<TQuestionAnswer>(), dtAnswerComments);
                return tq;
            }
        }
        public static int SubmitTutorQuestionAnswer(long TQuestionId, string Description = "", long UID = 0, long ObjEntityId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestionAnswer" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Description", Value = Description });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = ObjEntityId });
                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@ID";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                con.Open();
                cmd.ExecuteNonQuery();
                return Convert.ToInt32(cmd.Parameters["@ID"].Value);
            }
        }
        public static IList<Tags> GetAllTags(string connection = "")
        {
            IList<Tags> tags = new List<Tags>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTags" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Tags t = new Tags();
                    t.Id = Convert.ToInt32(rdr["ID"]);
                    t.Name = rdr["Name"].ToString();
                    t.TQuestionId = Convert.ToInt32(rdr["TQuestionId"]);
                    tags.Add(t);
                }
                return tags;
            }
        }

        public static IList<string> GetAllTagsUnique(string connection = "")
        {
            IList<string> tags = new List<string>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTagsUnique" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    tags.Add(rdr["Name"].ToString());
                }
                return tags;
            }
        }
        public static TQuestionComment AddTutorQuestionComment(long TQuestionId = 0, long UID = 0, long ObjEntityId = 0, string Description = "", string connection = "")
        {
            TQuestionComment addedComment = null;
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestionComment" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = ObjEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Description", Value = Description });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.Read())
                {
                    addedComment = new TQuestionComment();
                    addedComment.Id = Convert.ToInt64(rdr["ID"]);
                    addedComment.Description = rdr["Description"].ToString();
                    addedComment.TQuestionId = TQuestionId;
                    addedComment.UID = Convert.ToInt64(rdr["UID"]);
                    addedComment.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    addedComment.FirstName = rdr["FirstName"].ToString();
                    addedComment.LastName = rdr["LastName"].ToString();
                    addedComment.UserImg = rdr["ProfilePicture"].ToString();
                    addedComment.CommentTime = Convert.ToDateTime(rdr["CommentTime"]);
                }
            }

            return addedComment;
        }
        public static TQuestionAnswerComment AddTutorQuestionAnswerComment(long TQuestionAnswerId = 0, long UID = 0, long ObjEntityId = 0, string Description = "", string connection = "")
        {
            TQuestionAnswerComment addedComment = null;
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestionAnswerComment" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorQuestionAnswerId", Value = TQuestionAnswerId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = ObjEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Description", Value = Description });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                if (rdr.Read())
                {
                    addedComment = new TQuestionAnswerComment();
                    addedComment.Id = Convert.ToInt64(rdr["ID"]);
                    addedComment.Description = rdr["Description"].ToString();
                    addedComment.TQuestionAnswerId = TQuestionAnswerId;
                    addedComment.UID = Convert.ToInt64(rdr["UID"]);
                    addedComment.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    addedComment.FirstName = rdr["FirstName"].ToString();
                    addedComment.LastName = rdr["LastName"].ToString();
                    addedComment.UserImg = rdr["ProfilePicture"].ToString();
                    addedComment.CommentTime = Convert.ToDateTime(rdr["CommentTime"]);

                }
            }

            return addedComment;
        }
        public static IList<Tags> GetTagsRandomly(string connection = "")
        {
            IList<Tags> randomTags = new List<Tags>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetRandomTags" });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Tags t = new Tags();
                    t.Name = rdr["Name"].ToString();
                    randomTags.Add(t);
                }
            }
            return randomTags;
        }
        public static int Follow(long TQuestionId = 0, long UID = 0, int ObjEntityId = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestionFollow" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = ObjEntityId });

                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@ID";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                con.Open();
                cmd.ExecuteNonQuery();
                return Convert.ToInt32(cmd.Parameters["@ID"].Value);
            }
        }
        public static int Vote(long TQuestionAnswerId = 0, long UID = 0, int ObjEntityId = 0, int UpDowVote = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "InsertTutorQuestionAnswerVote" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorQuestionAnswerId", Value = TQuestionAnswerId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@ObjEntityId", Value = ObjEntityId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UpDownVote", Value = UpDowVote });

                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@ID";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                con.Open();
                cmd.ExecuteNonQuery();
                return Convert.ToInt32(cmd.Parameters["@ID"].Value);
            }
        }
        public static IList<TutorQuestion> GetAllQuestionsByTag(string TagName = "", string connection = "")
        {
            IList<TutorQuestion> allQuestionsByTag = new List<TutorQuestion>();
            DataTable dtTags = new DataTable();
            DataTable dtComments = new DataTable();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmdComments = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdComments.CommandType = CommandType.StoredProcedure;
                cmdComments.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllComments" });
                SqlCommand cmdTags = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdTags.CommandType = CommandType.StoredProcedure;
                cmdTags.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTags" });
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllQuestionsByTag" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Tagname", Value = TagName });
                SqlDataAdapter daTags = new SqlDataAdapter(cmdTags);
                daTags.Fill(dtTags);
                SqlDataAdapter daComments = new SqlDataAdapter(cmdComments);
                daComments.Fill(dtComments);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    TutorQuestion tq = new TutorQuestion();
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                    tq.tQuestionComments = GetCommentsByQuestionId(dtComments, tq.Id);
                    allQuestionsByTag.Add(tq);
                }
            }
            return allQuestionsByTag;
        }

        // get all question added, followed and answered in the same query
        public static IList<List<TutorQuestion>> GetTutorQuestionsCategories(long TutorId = 0, long UID = 0, string connection = "")
        {
            IList<List<TutorQuestion>> all = new List<List<TutorQuestion>>();
            IList<TutorQuestion> questionAnswered = new List<TutorQuestion>();
            IList<TutorQuestion> questionAdded = new List<TutorQuestion>();
            IList<TutorQuestion> questionFollowed = new List<TutorQuestion>();

            DataTable dtTags = new DataTable();
            DataTable dtComments = new DataTable();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmdTags = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdTags.CommandType = CommandType.StoredProcedure;
                cmdTags.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllTags" });

                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetTutorQuestionsCategories" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = TutorId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });

                SqlCommand cmdComments = new SqlCommand("sp_ManageTutorQuestions", con);
                cmdComments.CommandType = CommandType.StoredProcedure;
                cmdComments.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAllComments" });

                SqlDataAdapter daTags = new SqlDataAdapter(cmdTags);
                daTags.Fill(dtTags);

                SqlDataAdapter daComments = new SqlDataAdapter(cmdComments);
                daComments.Fill(dtComments);
                con.Open();

                SqlDataReader rdr = cmd.ExecuteReader();

                // Questions Added
                while (rdr.Read())
                {
                    TutorQuestion tq = new TutorQuestion();
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                    // bring the tags that are related to question tq.id
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                    // bring the comments that are related to question tq.id
                    tq.tQuestionComments = GetCommentsByQuestionId(dtComments, tq.Id);
                    questionAdded.Add(tq);
                }

                rdr.NextResult();

                // Questions Answered
                while (rdr.Read())
                {
                    TutorQuestion tq = new TutorQuestion();
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                    // bring the tags that are related to question tq.id
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                    // bring the comments that are related to question tq.id
                    tq.tQuestionComments = GetCommentsByQuestionId(dtComments, tq.Id);
                    questionAnswered.Add(tq);
                }

                rdr.NextResult();

                // Questions Followed
                while (rdr.Read())
                {
                    TutorQuestion tq = new TutorQuestion();
                    tq.Id = Convert.ToInt32(rdr["ID"]);
                    tq.Title = rdr["Title"].ToString();
                    tq.Description = rdr["Description"].ToString();
                    tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                    tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                    tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                    tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                    tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                    // bring the tags that are related to question tq.id
                    tq.tags = GetTagsByTutorQuestionId(dtTags, tq.Id);
                    // bring the comments that are related to question tq.id
                    tq.tQuestionComments = GetCommentsByQuestionId(dtComments, tq.Id);
                    questionFollowed.Add(tq);
                }

                questionAnswered = GetTagsForList(questionAnswered, dtTags);
                questionFollowed = GetTagsForList(questionFollowed, dtTags);
                questionAnswered = GetCommentsForList(questionAnswered, dtComments);
                questionFollowed = GetCommentsForList(questionFollowed, dtComments);
                all.Add(new List<TutorQuestion>(questionAdded));
                all.Add(new List<TutorQuestion>(questionAnswered));
                all.Add(new List<TutorQuestion>(questionFollowed));
                return all;
            }
        }

        // get all questions OR all questions by tag depending on the mode
        public static QAResponse<List<TutorQuestion>> GetAllTutorQuestions(int pageNumber = 1, int pageSize = 5, long UID = 0, string tag = "", string connection = "")
        {
            int remaining = 0;
            string mode = "GetAllTutorQuestions";
            List<TutorQuestion> allQuestions = new List<TutorQuestion>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                if (tag != "")
                {
                    mode = "GetQuestionsByTag";
                    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TagName", Value = tag });
                }
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = mode });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@PageNumber", Value = pageNumber });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RowsOfPage", Value = pageSize });
                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@RemainingPages";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TutorQuestion tq = null;
                while (rdr.Read())
                {
                    int id = Convert.ToInt32(rdr["ID"]);
                    if (tq != null && tq.Id == id)
                    {
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                    else
                    {
                        if (tq != null)
                        {
                            allQuestions.Add(tq);
                        }
                        tq = new TutorQuestion();
                        tq.Id = id;
                        tq.Title = rdr["Title"].ToString();
                        tq.Description = rdr["Description"].ToString();
                        tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                        tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                        tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                        tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                        tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                        tq.IsFollowing = Convert.ToBoolean(rdr["isFollowing"]);
                        tq.Status = Convert.ToBoolean(rdr["Status"]);
                        tq.ClosedVisible = false;
                        tq.FirstName = rdr["FirstName"].ToString();
                        tq.LastName = rdr["LastName"].ToString();
                        tq.UserImg = rdr["ProfilePicture"].ToString();
                        tq.tags = new List<Tags>();
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                }
                allQuestions.Add(tq);
                rdr.NextResult();
                remaining = Convert.ToInt32(cmd.Parameters["@RemainingPages"].Value);

            }
            QAResponse<List<TutorQuestion>> response = new QAResponse<List<TutorQuestion>>();
            response.Content = allQuestions;
            response.Extras.Add("remainingPages", remaining.ToString());
            response.Extras.Add("otherTopics", JsonConvert.SerializeObject(GetTagsRandomly(connection)));

            return response;
        }

        // gets either questions added OR Followed OR Answered
        public static QAResponse<List<TutorQuestion>> GetTutorQuestions(
                int pageNumber = 1, int pageSize = 5, long UID = 0, long tutorId = 0, int selectType = 1, string connection = ""
            )
        {
            int remaining = 0;
            string mode = null;

            switch (selectType)
            {
                case 1:
                    mode = "GetAddedQuestions";
                    break;
                case 2:
                    mode = "GetAnsweredQuestions";
                    break;
                case 3:
                    mode = "GetFollowedQuestions";
                    break;
                default:
                    return null;
            }
            List<TutorQuestion> allQuestions = new List<TutorQuestion>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = mode });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@PageNumber", Value = pageNumber });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@RowsOfPage", Value = pageSize });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = tutorId });

                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@RemainingPages";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);

                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TutorQuestion tq = null;
                while (rdr.Read())
                {
                    int id = Convert.ToInt32(rdr["ID"]);
                    if (tq != null && tq.Id == id)
                    {
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                    else
                    {
                        if (tq != null)
                        {
                            allQuestions.Add(tq);
                        }
                        tq = new TutorQuestion();
                        tq.Id = id;
                        tq.Title = rdr["Title"].ToString();
                        tq.Description = rdr["Description"].ToString();
                        tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                        tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                        tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                        tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                        tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                        tq.IsFollowing = Convert.ToBoolean(rdr["isFollowing"]);
                        tq.Status = Convert.ToBoolean(rdr["Status"]);
                        tq.ClosedVisible = mode == "GetAddedQuestions";
                        tq.FirstName = rdr["FirstName"].ToString();
                        tq.LastName = rdr["LastName"].ToString();
                        tq.UserImg = rdr["ProfilePicture"].ToString();
                        tq.tags = new List<Tags>();
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                }
                allQuestions.Add(tq);
                rdr.NextResult();
                remaining = Convert.ToInt32(cmd.Parameters["@RemainingPages"].Value);

            }
            QAResponse<List<TutorQuestion>> response = new QAResponse<List<TutorQuestion>>();
            response.Content = allQuestions;
            response.Extras.Add("remainingPages", remaining.ToString());
            response.Extras.Add("otherTopics", JsonConvert.SerializeObject(GetTagsRandomly(connection)));

            return response;
        }


        /*Tutor Question Answer Section*/


        // get the selected question of the page
        public static QAResponse<TutorQuestion> GetTutorQuestion(long UID = 0, long TQuestionId = 0, string connection = "")
        {
            TutorQuestion question = new TutorQuestion();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetTutorQuestionById" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TutorQuestion tq = null;
                while (rdr.Read())
                {
                    int id = Convert.ToInt32(rdr["ID"]);
                    if (tq != null && tq.Id == id)
                    {
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                    else
                    {
                        if (tq != null)
                        {
                            question = tq;
                        }
                        tq = new TutorQuestion();
                        tq.Id = id;
                        tq.Title = rdr["Title"].ToString();
                        tq.Description = rdr["Description"].ToString();
                        tq.Answered = Convert.ToBoolean(rdr["Answered"]);
                        tq.Followed = Convert.ToBoolean(rdr["Followed"]);
                        tq.CommentsNumber = Convert.ToInt32(rdr["CommentsNumber"]);
                        tq.FirstName = rdr["FirstName"].ToString();
                        tq.LastName = rdr["LastName"].ToString();
                        tq.UserImg = rdr["ProfilePicture"].ToString();
                        tq.FollowsNumber = Convert.ToInt32(rdr["FollowsNumber"]);
                        tq.AnswersNumber = Convert.ToInt32(rdr["AnswersNumber"]);
                        tq.TutorId = Convert.ToInt64(rdr["TutorId"]);
                        tq.IsFollowing = Convert.ToBoolean(rdr["isFollowing"]);
                        tq.tags = new List<Tags>();
                        Tags t = new Tags();
                        t.Name = rdr["TagName"].ToString();
                        if (t.Name != null && t.Name != "")
                        {
                            tq.tags.Add(t);
                        }
                    }
                }
                question = tq;

            }
            QAResponse<TutorQuestion> response = new QAResponse<TutorQuestion>();
            response.Content = question;
            response.Extras.Add("otherTopics", JsonConvert.SerializeObject(GetTagsRandomly(connection)));

            return response;
        }


        // get the answers to question selected
        public static QAResponse<List<TQuestionAnswer>> GetAllTutorQuestionAnswers(long UID = 0, long TQuestionId = 0, string connection = "")
        {
            QAResponse<List<TQuestionAnswer>> response = new QAResponse<List<TQuestionAnswer>>();
            List<TQuestionAnswer> answers = new List<TQuestionAnswer>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetQuestionAnswers" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionAnswer tqa = null;
                while (rdr.Read())
                {
                    tqa = new TQuestionAnswer();
                    tqa.Id = Convert.ToInt64(rdr["AnswerID"]);
                    tqa.TQuestionId = Convert.ToInt64(rdr["TQuestionId"]);
                    tqa.UID = Convert.ToInt64(rdr["UserID"]);
                    tqa.Description = rdr["AnswerDescription"].ToString();
                    tqa.isTutor = Convert.ToBoolean(rdr["isTutor"]);
                    tqa.FirstName = rdr["UserFirstName"].ToString();
                    tqa.LastName = rdr["UserLastName"].ToString();
                    tqa.UserImg = rdr["UserProfilePicture"].ToString();
                    tqa.AnswerLikesNumber = Convert.ToInt32(rdr["Likes"]);
                    tqa.AnswerDislikesNumber = Convert.ToInt32(rdr["Dislikes"]);
                    tqa.AnswerCommentsNumber = Convert.ToInt32(rdr["Comments"]);
                    tqa.Liked = Convert.ToInt32(rdr["Liked"]);
                    answers.Add(tqa);
                }
            }

            response.Content = answers;
            return response;
        }

        // get the comments to question selected
        public static QAResponse<List<TQuestionComment>> GetCommentsByQuestionId(long TQuestionId = 0, string connection = "")
        {
            QAResponse<List<TQuestionComment>> response = new QAResponse<List<TQuestionComment>>();
            List<TQuestionComment> comments = new List<TQuestionComment>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetQuesCommentsByQuestionId" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TQuestionId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionComment tqc = null;
                while (rdr.Read())
                {
                    tqc = new TQuestionComment();
                    tqc.Id = Convert.ToInt64(rdr["ID"]);
                    tqc.Description = rdr["Description"].ToString();
                    tqc.TQuestionId = TQuestionId;
                    tqc.UID = Convert.ToInt64(rdr["UID"]);
                    tqc.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    tqc.FirstName = rdr["FirstName"].ToString();
                    tqc.LastName = rdr["LastName"].ToString();
                    tqc.UserImg = rdr["ProfilePicture"].ToString();


                    comments.Add(tqc);
                }
            }

            response.Content = comments;
            return response;
        }

        // get commets for the selected answer
        public static QAResponse<List<TQuestionAnswerComment>> GetCommentsByQuestionAnswerId(long TutorQuestionAnswerId = 0, string connection = "")
        {
            QAResponse<List<TQuestionAnswerComment>> response = new QAResponse<List<TQuestionAnswerComment>>();
            List<TQuestionAnswerComment> comments = new List<TQuestionAnswerComment>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetQuestionAnswerCommentsByQAId" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorQuestionAnswerId", Value = TutorQuestionAnswerId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionAnswerComment tqc = null;
                while (rdr.Read())
                {
                    tqc = new TQuestionAnswerComment();
                    tqc.Id = Convert.ToInt64(rdr["ID"]);
                    tqc.Description = rdr["Description"].ToString();
                    tqc.TQuestionAnswerId = TutorQuestionAnswerId;
                    tqc.UID = Convert.ToInt64(rdr["UID"]);
                    tqc.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    tqc.FirstName = rdr["FirstName"].ToString();
                    tqc.LastName = rdr["LastName"].ToString();
                    tqc.UserImg = rdr["ProfilePicture"].ToString();

                    comments.Add(tqc);
                }
            }

            response.Content = comments;
            return response;
        }

        // get the followers of the selected question
        public static QAResponse<List<TQuestionFollower>> GetFollowersByQuestionId(long TutorQuestionId = 0, string connection = "")
        {
            QAResponse<List<TQuestionFollower>> response = new QAResponse<List<TQuestionFollower>>();
            List<TQuestionFollower> followers = new List<TQuestionFollower>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetQuestionFollowersByQId" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = TutorQuestionId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionFollower tqf = null;
                while (rdr.Read())
                {
                    tqf = new TQuestionFollower();
                    tqf.Id = Convert.ToInt64(rdr["ID"]);
                    tqf.TQuestionId = TutorQuestionId;
                    tqf.UID = Convert.ToInt64(rdr["UID"]);
                    tqf.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    tqf.FirstName = rdr["FirstName"].ToString();
                    tqf.LastName = rdr["LastName"].ToString();
                    tqf.UserImg = rdr["ProfilePicture"].ToString();

                    followers.Add(tqf);
                }
            }

            response.Content = followers;
            return response;
        }

        // get the likers of answer selected
        public static QAResponse<List<TQuestionAnswerLiker>> GetLikersByQuestionAnswerId(long TutorQuestionAnswerId = 0, string connection = "")
        {
            QAResponse<List<TQuestionAnswerLiker>> response = new QAResponse<List<TQuestionAnswerLiker>>();
            List<TQuestionAnswerLiker> likers = new List<TQuestionAnswerLiker>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetLikersByQAId" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorQuestionAnswerId", Value = TutorQuestionAnswerId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionAnswerLiker tqal = null;
                while (rdr.Read())
                {
                    tqal = new TQuestionAnswerLiker();
                    tqal.Id = Convert.ToInt64(rdr["ID"]);
                    tqal.TQuestionAnswerId = TutorQuestionAnswerId;
                    tqal.UID = Convert.ToInt64(rdr["UID"]);
                    tqal.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    tqal.FirstName = rdr["FirstName"].ToString();
                    tqal.LastName = rdr["LastName"].ToString();
                    tqal.UserImg = rdr["ProfilePicture"].ToString();

                    likers.Add(tqal);
                }
            }

            response.Content = likers;
            return response;
        }

        // get the dislikers of answer selected
        public static QAResponse<List<TQuestionAnswerDisliker>> GetDisLikersByQuestionAnswerId(long TutorQuestionAnswerId = 0, string connection = "")
        {
            QAResponse<List<TQuestionAnswerDisliker>> response = new QAResponse<List<TQuestionAnswerDisliker>>();
            List<TQuestionAnswerDisliker> dislikers = new List<TQuestionAnswerDisliker>();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetDisLikersByQAId" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorQuestionAnswerId", Value = TutorQuestionAnswerId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                TQuestionAnswerDisliker tqal = null;
                while (rdr.Read())
                {
                    tqal = new TQuestionAnswerDisliker();
                    tqal.Id = Convert.ToInt64(rdr["ID"]);
                    tqal.TQuestionAnswerId = TutorQuestionAnswerId;
                    tqal.UID = Convert.ToInt64(rdr["UID"]);
                    tqal.ObjEntityId = Convert.ToInt64(rdr["ObjEntityId"]);
                    tqal.FirstName = rdr["FirstName"].ToString();
                    tqal.LastName = rdr["LastName"].ToString();
                    tqal.UserImg = rdr["ProfilePicture"].ToString();

                    dislikers.Add(tqal);
                }
            }

            response.Content = dislikers;
            return response;
        }

        /*End Tutor Question Answer Section*/


        // close question
        public static int CloseQuestion(long tQuestionId = 0, long tutorID = 0, string connection = "")
        {

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageTutorQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "CloseQuestion" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TQuestionId", Value = tQuestionId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@TutorId", Value = tutorID });
                SqlParameter outPara = new SqlParameter();
                outPara.ParameterName = "@ID";
                outPara.DbType = DbType.Int32;
                outPara.SqlDbType = SqlDbType.Int;
                outPara.Direction = ParameterDirection.Output;
                cmd.Parameters.Add(outPara);
                con.Open();
                cmd.ExecuteNonQuery();
                return Convert.ToInt32(cmd.Parameters["@ID"].Value);
            }

        }
    }
}