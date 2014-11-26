/**
 * Created by Akash on 11/20/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class Image(ImageId: Int,LabelId: Int,GSVPanoramaId: String,Url: String,Path: String)

class Images(tag: Tag)
  extends Table[Image](tag, "Images") {

  def ImageId: Column[Int] = column[Int]("ImageId", O.PrimaryKey)
  def LabelId: Column[Int] = column[Int]("LabelId")
  def GSVPanoramaId: Column[String] = column[String]("GSVPanoramaId")
  def Url: Column[String] = column[String]("Url")
  def Path: Column[String] = column[String]("Path")

  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (ImageId, LabelId, GSVPanoramaId, Url, Path) <> (Image.tupled, Image.unapply _)
}
