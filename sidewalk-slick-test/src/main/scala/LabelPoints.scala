/**
 * Created by Akash on 11/25/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelPoint(LabelPointId: Int,LabelId: Int,svImageX: Int,svImageY: Int,originalCanvasX: Int,originalCanvasY: Int,
                      originalHeading: Int,originalPitch: Int,originalZoom: Int,canvasX: Int, canvasY:Int, heading: Int, pitch: Int, zoom: Int,
                      svImageHeight: Int,svImageWidth: Int,canvasHeight: Int, canvasWidth: Int,
                      alphaX:Double, alphaY: Double, labelLat: Double,labelLng: Double)

class LabelPoints(tag: Tag)
  extends Table[LabelPoint](tag, "LabelPoint") {

  def LabelPointId: Column[Int] = column[Int]("LabelPointId", O.PrimaryKey)
  def LabelId: Column[Int] = column[Int]("LabelId")
  def svImageX: Column[Int] = column[Int]("svImageX")
  def svImageY: Column[Int] = column[Int]("svImageY")
  def originalCanvasX: Column[Int] = column[Int]("originalCanvasX")
  def originalCanvasY: Column[Int] = column[Int]("originalCanvasY")
  def originalHeading: Column[Int] = column[Int]("originalHeading")
  def originalPitch: Column[Int] = column[Int]("originalPitch")
  def originalZoom: Column[Int] = column[Int]("originalZoom")
  def canvasX: Column[Int] = column[Int]("canvasX")
  def canvasY: Column[Int] = column[Int]("canvasY")
  def heading: Column[Int] = column[Int]("heading")
  def pitch: Column[Int] = column[Int]("pitch")
  def zoom: Column[Int] = column[Int]("zoom")
  def svImageHeight: Column[Int] = column[Int]("svImageHeight")
  def svImageWidth: Column[Int] = column[Int]("svImageWidth")
  def canvasHeight: Column[Int] = column[Int]("canvasHeight")
  def canvasWidth: Column[Int] = column[Int]("canvasWidth")

  def alphaX: Column[Double] = column[Double]("alphaX")
  def alphaY: Column[Double] = column[Double]("alphaY")
  def labelLat: Column[Double] = column[Double]("labelLat")
  def labelLng: Column[Double] = column[Double]("labelLng")







  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (LabelPointId,LabelId,svImageX,svImageY,originalCanvasX,originalCanvasY,
    originalHeading,originalPitch,originalZoom,canvasX, canvasY, heading, pitch, zoom,
    svImageHeight,svImageWidth,canvasHeight, canvasWidth,
    alphaX, alphaY, labelLat,labelLng) <> (LabelPoint.tupled, LabelPoint.unapply _)
}

