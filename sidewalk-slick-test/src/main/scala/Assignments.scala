/**
 * Created by kotarohara on 11/5/14.
 */
import scala.slick.driver.H2Driver.simple._
//import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape

class Assignments(tag: Tag)
  extends Table[(Int, String, String, String, String, String, Int, Int, String, String)](tag, "Assignments") {

  // This is the primary key column:
  def AssignmentId: Column[Int] = column[Int]("AssignmentId", O.PrimaryKey)
  def AmazonTurkerId: Column[String] = column[String]("AmazonTurkerId")
  def AmazonHitId: Column[String] = column[String]("AmazonHitId")
  def AmazonAssignmentId: Column[String] = column[String]("AmazonAssignmentId")
  def InterfaceType: Column[String] = column[String]("InterfaceType")
  def InterfaceVersion: Column[String] = column[String]("InterfaceVersion")
  def Completed: Column[Int] = column[Int]("Completed")
  def NeedQualification: Column[Int] = column[Int]("NeedQualification")
  def TaskDescription: Column[String] = column[String]("TaskDescription")
  def DatetimeInserted: Column[String] = column[String]("DatetimeInserted")

  // Every table needs a * projection with the same type as the table's type parameter
  def * : ProvenShape[(Int, String, String, String, String, String, Int, Int, String, String)] =
    (AssignmentId, AmazonTurkerId, AmazonHitId, AmazonAssignmentId, InterfaceType, InterfaceVersion, Completed,
      NeedQualification, TaskDescription, DatetimeInserted)
}