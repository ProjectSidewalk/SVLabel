/**
 * Created by Akash on 11/25/2014.
 */

import java.sql.Timestamp

import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskInteraction(LabelingTaskInteractionId: Int,LabelingTaskId: Int,Action: String,GSVPanoramaId:String,
                                   lat: String,lng: String,heading: Int,pitch: Int,zoom: Int,Note: String,Timestamp: String )

class LabelingTaskInteractions(tag: Tag)
  extends Table[LabelingTaskInteraction](tag, "LabelingTaskInteraction") {

  def LabelingTaskInteractionId: Column[Int] = column[Int]("LabelingTaskInteractionId", O.PrimaryKey)
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId")
  def Action: Column[String] = column[String]("Action")
  def GSVPanoramaId: Column[String] = column[String]("GSVPanoramaId")
  def lat: Column[String] = column[String]("lat")
  def lng: Column[String] = column[String]("lng")
  def heading: Column[Int] = column[Int]("heading")
  def pitch: Column[Int] = column[Int]("pitch")
  def zoom: Column[Int] = column[Int]("zoom")
  def Note: Column[String] = column[String]("Note")
  def Timestamp: Column[String] = column[String]("Timestamp")










  def * = (LabelingTaskInteractionId,LabelingTaskId,Action,GSVPanoramaId,lat,lng,heading,pitch,zoom,Note,Timestamp) <> (LabelingTaskInteraction.tupled, LabelingTaskInteraction.unapply _)
}