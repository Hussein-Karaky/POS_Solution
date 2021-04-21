using BLL.Shared;
using BLL.Shared.Struct;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text;
using System.Linq;
using System.Net.Sockets;
using System.Management;
using System.Net.NetworkInformation;

namespace DAL.Shared
{
    public class FileDB
    {
        public static DataList<File> GetFiles(int userId, int sourceType, int lang, string conStr = "")
        {
            string deviceName = Environment.MachineName;
            string filePath = System.IO.Path.GetTempFileName();
            IList<File> files = new List<File>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFiles", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@UserId", Value = userId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@SourceType", Value = sourceType });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@DeviceName", Value = deviceName });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@StorageDriveNumber", Value = GetHardDiskDSerialNumber(filePath.Split(':')[0]) });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Lang", Value = lang });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", SqlDbType = SqlDbType.VarChar, Value = "get" });

                connection.Open();

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    files.Clear();
                    while (reader.Read())
                    {
                        files.Add(new File(reader));
                    }
                }
            }
            return new DataList<File>(files);
        }
        public static DataList<File> GetFile(int id, int lang, string conStr = "")
        {
            IList<File> files = new List<File>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFiles", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Lang", Value = lang });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@Mode", SqlDbType = SqlDbType.VarChar, Value = "get" });

                connection.Open();

                SqlDataReader reader = cmd.ExecuteReader();
                if (reader.HasRows)
                {
                    files.Clear();
                    while (reader.Read())
                    {
                        files.Add(new File(reader));
                    }
                }
            }
            return new DataList<File>(files);
        }

        public static DataList<File> DeleteFile(long id, int sourceType, long userId, int lang = 1, string conStr = "")
        {
            IList<File> files = new List<File>();
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                SqlCommand cmd = new SqlCommand("sp_ManageFiles", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Id", Value = id });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@SourceType", Value = sourceType });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@UserId", Value = userId });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Lang", Value = lang });
                cmd.Parameters.Add(new SqlParameter() { ParameterName = "@Mode", Value = "delete" });
                connection.Open();
                try
                {
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        files.Clear();
                        while (reader.Read())
                        {
                            File file = new File(reader);
                            System.IO.File.Delete(file.Path);
                            files.Add(file);
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
            return new DataList<File>(files);
        }

        public static IList<File> AddFiles(IList<File> files, int sourceType, long userId, int lang, string conStr)
        {
            using (SqlConnection connection = new SqlConnection(conStr))
            {
                string deviceName = Environment.MachineName;
                var nic =
                        (
                            from n in NetworkInterface.GetAllNetworkInterfaces()
                            where n.OperationalStatus == OperationalStatus.Up && 
                            n.NetworkInterfaceType != NetworkInterfaceType.Loopback
                            select n
                        ).FirstOrDefault();
                var ip = (
                    from address in nic.GetIPProperties().UnicastAddresses
                    where address.DuplicateAddressDetectionState == DuplicateAddressDetectionState.Preferred &&
                    address.IPv4Mask.AddressFamily == AddressFamily.InterNetwork &&
                    address.IPv4Mask.Address != 0
                    select address).FirstOrDefault();
                DataTable dtFiles = new DataTable();
                dtFiles.Columns.Add("Name", typeof(string));
                dtFiles.Columns.Add("Path", typeof(string));
                dtFiles.Columns.Add("DeviceName", typeof(string));
                dtFiles.Columns.Add("DeviceIP", typeof(string));
                dtFiles.Columns.Add("DeviceIPValue", typeof(long));
                dtFiles.Columns.Add("DevicePhysicalAddress", typeof(string));
                dtFiles.Columns.Add("StorageDriveNumber", typeof(string));
                dtFiles.Columns.Add("Type", typeof(string));
                dtFiles.Columns.Add("Size", typeof(long));
                dtFiles.Columns.Add("Description", typeof(string));
                dtFiles.Columns.Add("SourceType", typeof(int));
                dtFiles.Columns.Add("SourceId", typeof(long));
                dtFiles.Columns.Add("ReadOnly", typeof(bool));
                dtFiles.Columns.Add("ExpiryDate", typeof(DateTime));
                dtFiles.Columns.Add("DateCreated", typeof(DateTime));
                dtFiles.Columns.Add("DateModified", typeof(DateTime));
                ((List<File>)files).ForEach(d =>
                {
                    DataRow row = dtFiles.NewRow();
                    string drive = d.Path.Split(':')[0];
                    row["Name"] = d.Name;
                    row["Path"] = d.Path;
                    row["DeviceName"] = deviceName;
                    row["DeviceIP"] = ip.Address.ToString();
                    row["DeviceIPValue"] = ip.Address.Address;
                    row["DevicePhysicalAddress"] = nic.GetPhysicalAddress().ToString();
                    row["StorageDriveNumber"] = GetHardDiskDSerialNumber(drive);
                    row["Type"] = d.Type;
                    row["Size"] = d.Size;
                    row["Description"] = d.Description;
                    row["SourceType"] = (int)d.SourceType;
                    row["ReadOnly"] = true;
                    row["Description"] = d.Description;
                    dtFiles.Rows.Add(row);
                });
                SqlCommand cmd = new SqlCommand("sp_ManageFiles", connection);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@UserId", Value = userId });
                cmd.Parameters.Add(new SqlParameter { ParameterName = "@LanguageId", Value = lang });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Files",
                    TypeName = "udt_File",
                    SqlDbType = SqlDbType.Structured,
                    Value = dtFiles
                });
                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@SourceType",
                    SqlDbType = SqlDbType.Int,
                    Value = sourceType
                });

                cmd.Parameters.Add(new SqlParameter
                {
                    ParameterName = "@Mode",
                    SqlDbType = SqlDbType.VarChar,
                    Value = "AddFiles"
                });

                connection.Open();
                try
                {
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        files.Clear();
                        while (reader.Read())
                        {
                            files.Add(new File(reader));
                        }
                    }
                }
                catch (Exception ex)
                {
                    return files;
                }
            }
            return files;
        }

        public static string GetHardDiskDSerialNumber(string drive)
        {
            //Check to see if the user provided a drive letter
            //If not default it to "C"
            if (string.IsNullOrEmpty(drive) || drive == null)
            {
                drive = "C";
            }
            //Create our ManagementObject, passing it the drive letter to the
            //DevideID using WQL
            ManagementObject disk = new ManagementObject("Win32_LogicalDisk.DeviceID=\"" + drive + ":\"");
            //bind our management object
            disk.Get();
            //Return the serial number
            return disk["VolumeSerialNumber"].ToString();
        }
    }
}
