using BLL.Test;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using BLL;
using BLL.Shared;

namespace DAL.Test
{
    public class TestDB
    {
        public static BLL.Test.Test GetTest(int sysId = 0, int language = 1, string connection = "")
        {
            BLL.Test.Test t = new BLL.Test.Test();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageQATemplate", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "ViewBySubjectMaterial" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SubjectMaterialId", Value = sysId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    t.Id = Convert.ToInt32(rdr["ID"]);
                    t.Description = rdr["Description"].ToString();
                    t.TimeFrame = Convert.ToDouble(rdr["TimeFrame"]);
                    t.TotalToPass = Convert.ToInt32(rdr["TotalToPass"]);
                }
                t.question = GetTestQuestions(sysId, language, connection);
            }
            return t;
        }
        public static IList<Question> GetTestQuestions(int sysId = 0, int language = 1, string connection = "")
        {
            IList<Question> questions = new List<Question>();
            DataTable dt = new DataTable();

            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmdAnswer = new SqlCommand("sp_ManageQuestions", con);
                cmdAnswer.CommandType = CommandType.StoredProcedure;
                cmdAnswer.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetAnswersBySubjectMaterial" });
                cmdAnswer.Parameters.Add(new SqlParameter() { ParameterName = "@SubjectMaterialId", Value = sysId });
                cmdAnswer.Parameters.Add(new SqlParameter() { ParameterName = "@LanguageId", Value = language });


                SqlCommand cmd = new SqlCommand("sp_ManageQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "GetQuestionsBySubjectMaterial" });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@SubjectMaterialId", Value = sysId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = language });
                SqlDataAdapter da = new SqlDataAdapter(cmdAnswer);
                da.Fill(dt);
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Question question = new Question();
                    question.Id = Convert.ToInt32(rdr["ID"]);
                    question.Description = rdr["Description"].ToString();
                    question.FieldTypeId = Convert.ToInt32(rdr["FieldTypeId"]);
                    question.FieldTypeName = rdr["FieldTypeName"].ToString();
                    question.DisplayId = Convert.ToInt32(rdr["DisplayId"]);
                    question.DisplayName = rdr["DisplayName"].ToString();
                    question.answer = GetAnswers(dt, question.Id);
                    questions.Add(question);
                }
                return questions;
            }
        }
        public static IList<Answer> GetAnswers(DataTable dt = null, int QuestionId = 0)
        {
            if (dt != null && dt.Rows.Count > 0)
                return dt.AsEnumerable().Where(r => int.Parse(r["QuestionId"].ToString()) == QuestionId).Select(f => new Answer { Id = Convert.ToInt32(f["ID"]), QuestionId = Convert.ToInt32(f["QuestionId"]), AnswerDescription = f["AnswerName"].ToString(), Correct = Convert.ToBoolean(f["Correct"]) }).ToList<Answer>();
            return new List<Answer>();
        }


        public static QAResponse<IList<Question>> LoadTest(int sysId = 0, int language = 1, string connection = "")
            {
            IDictionary<string, string> Extras =new Dictionary<string, string>();
            QAResponse<IList<Question>> response = new QAResponse<IList<Question>>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageQATemplate", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "ViewBySubjectMaterial" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SubjectMaterialId", Value = sysId });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Extras.Add("QATempId",Convert.ToInt32(rdr["ID"]).ToString());
                    Extras.Add("Description",rdr["Description"].ToString());
                    Extras.Add("TimeFrame",Convert.ToDouble(rdr["TimeFrame"]).ToString());
                    Extras.Add("TotalToPass",Convert.ToInt32(rdr["TotalToPass"]).ToString());
                }
            }
            //response=LoadTestQuestions(sysId,language,connection);
            response.Extras=Extras;
            return response;
        }
        public static QAResponse<IList<Question>> LoadTestQuestions(int sysId = 0, int language = 1, string connection = "")
        {
            QAResponse<IList<Question>> response = new QAResponse<IList<Question>>();
            response.Content=new List<Question>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageQuestions", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "getQuestionsAnswers" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SubjectMaterialId", Value = sysId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = language });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                Question q = null;
                while (rdr.Read())
                {
                    int id = Convert.ToInt32(rdr["QuestionID"]);
                    if (q != null && id != q.Id)
                    {
                        response.Content.Add(q);
                        q = null;
                    }

                    if (q == null)
                    {
                        q = new Question();
                        q.Id = id;
                        q.Description = rdr["Description"].ToString();
                        q.CatId = Convert.ToInt32(rdr["CatId"]);
                        q.FieldTypeId = Convert.ToInt32(rdr["FieldTypeId"]);
                        q.FieldTypeName = rdr["FieldTypeName"].ToString();
                        q.DisplayId = Convert.ToInt32(rdr["DisplayId"]);
                        q.DisplayName = rdr["DisplayName"].ToString();
                        //q.Points = Convert.ToInt32(rdr["Points"]);
                        q.answer = new List<Answer>();
                    }
                    Answer a = new Answer();
                    a.Id = Convert.ToInt32(rdr["AnswerID"]);
                    a.QuestionId = Convert.ToInt32(rdr["QuestionID"]);
                    a.AnswerDescription = rdr["AnswerName"].ToString();
                    a.Correct = Convert.ToBoolean(rdr["Correct"]);
                    q.answer.Add(a);
                }
                response.Content.Add(q);

            }
            return response;
        }

        public static int StartTest(int QATemplateId = 0, long UID = 0, string connection = "")
        {
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageQA", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "StartTest" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@QATemplateId", Value = QATemplateId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                con.Open();
                cmd.ExecuteNonQuery();
                return 1;
            }
        }

        public static DataTable EndTest(DataTable dt, int QATemplateId = 0, long UID = 0, string connection = "")
        {
            DataTable UserAnswer = new DataTable();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageQA", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", Value = "EndTest" });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@QATemplateId", Value = QATemplateId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@tmpTable", Value = dt });
                con.Open();
                SqlDataAdapter da = new SqlDataAdapter(cmd);
                da.Fill(UserAnswer);
                return UserAnswer;
            }
        }
    }
}
