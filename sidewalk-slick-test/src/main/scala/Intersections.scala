/**
 * Created by Akash on 11/20/2014.
 */
import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class Intersection(IntersectionId: Int,Lat: String,Lng: String,NearestGSVPanoramaId: String, NumberOfLinks: Int, Note: String, PhysicalAuditId: String,
                        City: String)
class Intersections(tag: Tag)
  extends Table[Intersection](tag, "Intersections") {

  def IntersectionId: Column[Int] = column[Int]("IntersectionId", O.PrimaryKey)
  def Lat: Column[String] = column[String]("Lat")
  def Lng: Column[String] = column[String]("Lng")
  def NearestGSVPanoramaId: Column[String] = column[String]("NearestGSVPanoramaId")
  def NumberOfLinks: Column[Int] = column[Int]("NumberOfLinks")
  def Note: Column[String] = column[String]("Note")
  def PhysicalAuditId: Column[String] = column[String]("PhysicalAuditId")
  def City: Column[String] = column[String]("String")


  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (IntersectionId, Lat, Lng, NearestGSVPanoramaId, NumberOfLinks,Note,PhysicalAuditId,City) <> (Intersection.tupled, Intersection.unapply _)
}
