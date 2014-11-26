import scala.slick.driver.H2Driver.simple._
//import scala.slick.driver.MySQLDriver.simple._
import java.sql.Timestamp
import scala.slick.lifted.ProvenShape

import org.joda.time.DateTime

case class LabelingTask(LabelingTaskId: Int, AssignmentId: Int, TaskPanoramaId: Int, TaskGSVPanoramaId: String,
                        NoLabel: Int, Description: String, PreviousLabelingTaskId: Int, DatetimeInserted: DateTime)

class LabelingTasks(tag: Tag)
  extends Table[LabelingTask](tag, "LabelingTasks") {

  // Akash Magoon 11/6/2014
  // Object Relational Mapping for sidewalk.LabelingTasks
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId", O.PrimaryKey)
  def AssignmentId: Column[Int] = column[Int]("AssignmentId")
  def TaskPanoramaId: Column[Int] = column[Int]("TaskPanoramaId")
  def TaskGSVPanoramaId: Column[String] = column[String]("TaskGSVPanoramaId")
  def NoLabel: Column[Int] = column[Int]("NoLabel")
  def Description: Column[String] = column[String]("Description")
  def PreviousLabelingTaskId: Column[Int] = column[Int]("PreviousLabelingTaskId")

  implicit val dateTimeColumnType = MappedColumnType.base[DateTime, Timestamp](
  { dt => new java.sql.Timestamp(dt.getMillis) },
  { ts => new DateTime(ts) }
  )
  def DatetimeInserted: Column[DateTime] = column[DateTime]("DatetimeInserted")

  def * = (LabelingTaskId, AssignmentId, TaskPanoramaId, TaskGSVPanoramaId, NoLabel, Description,
    PreviousLabelingTaskId, DatetimeInserted) <> (LabelingTask.tupled, LabelingTask.unapply _)
}