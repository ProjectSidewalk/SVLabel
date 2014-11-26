import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class GoldenLabel(GoldenLabelId: Int, TaskImageId: Int, LabelTypeId: Int)

class GoldenLabels(tag: Tag)
  extends Table[GoldenLabel](tag, "goldenLabels") {

  def GoldenLabelId: Column[Int] = column[Int]("GoldenLabelId", O.PrimaryKey)
  def TaskImageId: Column[Int] = column[Int]("TaskImageId")
  def LabelTypeId: Column[Int] = column[Int]("LabelTypeId")

//  def * : ProvenShape[(Int,Int,Int)] =
//    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (GoldenLabelId, TaskImageId, LabelTypeId) <> (GoldenLabel.tupled, GoldenLabel.unapply _)
}
