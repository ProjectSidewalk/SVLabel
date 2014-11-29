/**
 * Created by Akash on 11/21/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskCount(LabelingTaskCountId: Int, TaskPanoramaId: Int, TaskCount: Int)

class LabelingTaskCounts(tag: Tag)
  extends Table[LabelingTaskCount](tag, "LabelingTaskCount") {

  def LabelingTaskCountId: Column[Int] = column[Int]("LabelingTaskCountId", O.PrimaryKey)
  def TaskPanoramaId: Column[Int] = column[Int]("TaskPanoramaId")
  def TaskCount: Column[Int] = column[Int]("TaskCount")

  def * = (LabelingTaskCountId,TaskPanoramaId,TaskCount) <> (LabelingTaskCount.tupled, LabelingTaskCount.unapply _)
}
