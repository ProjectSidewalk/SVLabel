/**
 * Created by kotarohara on 11/5/14.
 */
import scala.slick.driver.H2Driver.simple._
//import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape

class LabelingTasks(tag: Tag)
  extends Table[(Int,Int,Int,String,Int,String,Int,String)](tag, "LabelingTasks") {

  // Akash Magoon 11/6/2014
  // Object Relational Mapping for sidewalk.LabelingTasks
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId", O.PrimaryKey)
  def AssignmentId: Column[Int] = column[Int]("AssignmentId")
  def TaskPanoramaId: Column[Int] = column[Int]("TaskPanoramaId")
  def TaskGSVPanoramaId: Column[String] = column[String]("TaskGSVPanoramaId")
  def NoLabel: Column[Int] = column[Int]("NoLabel")
  def Description: Column[String] = column[String]("Description")
  def PreviousLabelingTaskId: Column[Int] = column[Int]("PreviousLabelingTaskId")
  def DatetimeInserted: Column[String] = column[String]("DatetimeInserted")

  def * : ProvenShape[(Int,Int,Int,String,Int,String,Int,String)] =
    (LabelingTaskId,AssignmentId,TaskPanoramaId,TaskGSVPanoramaId,NoLabel,Description,PreviousLabelingTaskId,DatetimeInserted)
}