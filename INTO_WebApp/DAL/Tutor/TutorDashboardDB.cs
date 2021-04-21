using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using BLL.Shared;
using BLL.Tutor;
using BLL.Tutor.TutorDashboard;
using Newtonsoft.Json;

namespace DAL.Tutor
{
    public class TutorDashboardDB
    {
        public static QAResponse<List<BoardItem>> GetBoardData(long UID = 0, string connection = "")
        {
            QAResponse<List<BoardItem>> response = new QAResponse<List<BoardItem>>();
            List<BoardItem> items = new List<BoardItem>();

            //using (SqlConnection con = new SqlConnection(connection))
            //{
            //    SqlCommand cmd = new SqlCommand("sp_ManageTutorDashboard", con);
            //    cmd.CommandType = CommandType.StoredProcedure;
            //    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "GetDashboardTabs" });
            //    cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UID", Value = UID });
            //    con.Open();
            //    SqlDataReader rdr = cmd.ExecuteReader();
            //    BoardItem boardItem = null;
            //    while (rdr.Read())
            //    {
            //        boardItem = new BoardItem();
            //        boardItem.Id = Convert.ToInt64(rdr["AnswerID"]);
            //        boardItem.Type = rdr[""].ToString();
            //        boardItem.Data = rdr[""].ToString();
            //        boardItem.DataTitle = rdr[""].ToString();
                    
            //        items.Add(boardItem);
            //    }
            //}
            BoardItem boardItem = new BoardItem();
            boardItem.Id =100;
            boardItem.Type ="student";
            boardItem.Data = "23";
            boardItem.DataTitle = "Total Students";
            items.Add(boardItem);

            BoardItem boardItem2 = new BoardItem();
            boardItem2.Id =101;
            boardItem2.Type ="course";
            boardItem2.Data = "15";
            boardItem2.DataTitle = "Total Courses";
            items.Add(boardItem2);

            BoardItem boardItem3 = new BoardItem();
            boardItem3.Id =102;
            boardItem3.Type ="request";
            boardItem3.Data = "20";
            boardItem3.DataTitle = "Total Requests";
            items.Add(boardItem3);
            
            BoardItem boardItem4 = new BoardItem();
            boardItem4.Id =103;
            boardItem4.Type ="message";
            boardItem4.Data = "0";
            boardItem4.DataTitle = "Total Messages";
            items.Add(boardItem4);

            response.Content = items;
            return response;
        }
    }
}
