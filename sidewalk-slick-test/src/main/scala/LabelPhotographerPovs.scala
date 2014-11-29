/**
 * Created by Akash on 11/25/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelPhotographerPov(LabelPhotographerPovId: Int,LabelId: Int, PhotographerHeading: Float,PhotographerPitch: Float )

class LabelPhotographerPovs(tag: Tag)
  extends Table[LabelPhotographerPov](tag, "LabelPhotographerPov") {

  def LabelPhotographerPovId: Column[Int] = column[Int]("LabelPhotographerPovId", O.PrimaryKey)
  def LabelId: Column[Int] = column[Int]("LabelId")
  def PhotographerHeading: Column[Float] = column[Float]("PhotographerHeading")
  def PhotographerPitch: Column[Float] = column[Float]("PhotographerPitch")






  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (LabelPhotographerPovId, LabelId, PhotographerHeading, PhotographerPitch) <> (LabelPhotographerPov.tupled, LabelPhotographerPov.unapply _)
}
