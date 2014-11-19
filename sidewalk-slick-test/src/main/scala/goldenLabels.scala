/**
 * Created by Akash on 11/19/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape
class goldenLabels(tag: Tag)
  extends Table[(Int,Int,Int)](tag, "goldenLabels") {

  def GoldenLabelId: Column[Int] = column[Int]("GoldenLabelId", O.PrimaryKey)
  def TaskImageId: Column[Int] = column[Int]("TaskImageId")
  def LabelTypeId: Column[Int] = column[Int]("LabelTypeId")


  def * : ProvenShape[(Int,Int,Int)] =
    (GoldenLabelId,TaskImageId,LabelTypeId)

}
