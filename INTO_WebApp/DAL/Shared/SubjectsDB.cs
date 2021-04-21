using BLL.Shared;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace DAL.Shared
{
    public class SubjectsDB
    {
        public static List<Curriculum> GetCurriculumByLanguageId(int Id = 0, string connection = "")
        {
            List<Curriculum> Curriculums = new List<Curriculum>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    Value = "GetbyLookupId"
                });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@LookupId",
                    Value = 5
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = Id
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Curriculum curriculum = new Curriculum();
                    curriculum.Id = Convert.ToInt32(rdr["id"]);
                    curriculum.Name = rdr["description"].ToString();
                    Curriculums.Add(curriculum);
                }
            }
            return Curriculums;
        }
        public static List<InstituteType> GetInstituteTypeByLanguageId(int Id = 0, string connection = "")
        {
            List<InstituteType> Institutetype = new List<InstituteType>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    Value = "GetbyLookupId"
                });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@LookupId",
                    Value = 35
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = Id
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    InstituteType institutetype = new InstituteType();
                    institutetype.Id = Convert.ToInt32(rdr["id"]);
                    institutetype.Name = rdr["description"].ToString();
                    Institutetype.Add(institutetype);
                }
            }
            return Institutetype;
        }
        public static List<Cycle> GetCycleByLanguageId(int Id = 0, string connection = "")
        {
            List<Cycle> Cycle = new List<Cycle>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageLookup", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    Value = "GetbyLookupId"
                });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@LookupId",
                    Value = 33
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = Id
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Cycle cycle = new Cycle();
                    cycle.Id = Convert.ToInt32(rdr["id"]);
                    cycle.Name = rdr["description"].ToString();
                    Cycle.Add(cycle);
                }
            }
            return Cycle;
        }
        public static IList<Subject> GetSubjectsMaterials(int instituteType = 0, int cycle = 0, int? lang = 0, string connection = "")
        {
            IList<Subject> Subjects = new List<Subject>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_TutorSubjects", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    Value = "GetSubjectsMaterials"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@LanguageId",
                    Value = lang
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@CycleId",
                    Value = cycle
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@InstituteTypeId",
                    Value = instituteType
                });
                con.Open();
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
                        Subjects.Add(subject);
                    }
                }
            }
            return Subjects;
        }
        public static DataSet GetData(string SPName = "", SqlParameter SPParameter = null, string connection = "")
        {
            SqlConnection con = new SqlConnection(connection);
            SqlDataAdapter da = new SqlDataAdapter(SPName, con);
            da.SelectCommand.CommandType = CommandType.StoredProcedure;
            if (SPParameter != null)
            {
                da.SelectCommand.Parameters.Add(SPParameter);
            }
            DataSet DS = new DataSet();
            da.Fill(DS);
            return DS;
        }
        public static IList<Material> GetSubjectsClass(int classId = 0, string connection = "")
        {
            IList<Material> SubjectsClass = new List<Material>();
            using (SqlConnection con = new SqlConnection(connection))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFindTutorFilter", con);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    Value = "ClassMaterials"
                });
                cmd.Parameters.Add(new SqlParameter()
                {
                    ParameterName = "@ClassId",
                    Value = classId
                });
                con.Open();
                SqlDataReader rdr = cmd.ExecuteReader();
                while (rdr.Read())
                {
                    Material material = new Material
                    {
                        SysId = Convert.ToInt32(rdr["SysId"]),
                        Id = Convert.ToInt32(rdr["MaterialId"]),
                        Subject = new Subject
                        {
                            Id = Convert.ToInt32(rdr["SubjectId"]),
                            Name = rdr["SubjectName"].ToString()
                        },
                        Name = rdr["MaterialName"].ToString()
                    };
                    SubjectsClass.Add(material);

                }
            }
            return SubjectsClass;
        }

    }
}
