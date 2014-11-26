/**
 * Created by Akash on 11/21/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelBin(LabelBinId: Int,TaskPanoramaId: String,LabelingTaskId: String, LabelBinDescription: String,NoLabel: Int )

class LabelBins(tag: Tag)
  extends Table[LabelBin](tag, "LabelBins") {

  def LabelBinId: Column[Int] = column[Int]("LabelBinId", O.PrimaryKey)
  def TaskPanoramaId: Column[String] = column[String]("TaskPanoramaId")
  def LabelingTaskId: Column[String] = column[String]("LabelingTaskId")
  def LabelBinDescription: Column[String] = column[String]("LabelBinDescription")
  def NoLabel: Column[Int] = column[Int]("NoLabel")


  def * = (LabelBinId, TaskPanoramaId, LabelingTaskId, LabelBinDescription,NoLabel ) <> (LabelBin.tupled, LabelBin.unapply _)
}

