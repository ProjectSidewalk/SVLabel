/**
 * Created by kotarohara on 11/5/14.
 */
import scala.slick.driver.H2Driver.simple._
//import scala.slick.driver.MySQLDriver.simple._
import scala.slick.lifted.ProvenShape

class LabelingTasks(tag: Tag)
  extends Table[(Int)](tag, "LabelingTasks") {

  // Todo: Akash
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId", O.PrimaryKey)

  // Todo: Akash
  def * : ProvenShape[(Int)] =
    (LabelingTaskId)
}