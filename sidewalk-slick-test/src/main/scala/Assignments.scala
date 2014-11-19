/**
 * Created by kotarohara on 11/5/14.
 */
import scala.slick.driver.H2Driver.simple._
//import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape
import java.sql.Timestamp
import org.joda.time.DateTime

case class Assignment(AssignmentId: Int, AmazonTurkerId: String, AmazonHitId: String, AmazonAssignmentId: String,
                      InterfaceType: String, InterfaceVersion: String, Completed: Int, NeedQualification: Int,
                      TaskDescription: String, DatetimeInserted: DateTime)

class Assignments(tag: Tag)
  extends Table[Assignment](tag, "Assignments") {

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

  // Converting joda datetime
  // http://stackoverflow.com/questions/22942202/slick-library-w-play-date-type-incompatibility
  // https://groups.google.com/forum/#!msg/scalaquery/4Ns_J_8wbqQ/0SGiJL4O8A8J
  // http://www.epochconverter.com/
  implicit val dateTimeColumnType = MappedColumnType.base[DateTime, Timestamp](
    { dt => new java.sql.Timestamp(dt.getMillis) },
    { ts => new DateTime(ts) }
  )

  def DatetimeInserted: Column[DateTime] = column[DateTime]("DatetimeInserted")

  def * = (AssignmentId, AmazonTurkerId, AmazonHitId, AmazonAssignmentId, InterfaceType, InterfaceVersion, Completed,
    NeedQualification, TaskDescription, DatetimeInserted) <> (Assignment.tupled, Assignment.unapply _)
}
  // Every table needs a * projection with the same type as the table's type parameter
//  def * : ProvenShape[(Int, String, String, String, String, String, Int, Int, String, String)] =
//    (AssignmentId, AmazonTurkerId, AmazonHitId, AmazonAssignmentId, InterfaceType, InterfaceVersion, Completed,
//      NeedQualification, TaskDescription, DatetimeInserted)
//}