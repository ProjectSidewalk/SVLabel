/**
 * Created by Akash on 11/21/2014.
 */

import java.sql.Blob

import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskAttribute(LabelingTaskAttributeId: Int,LabelingTaskId: Int,Attribute:String /*,Value : Blob*/)

class LabelingTaskAttributes(tag: Tag)
  extends Table[LabelingTaskAttribute](tag, "LabelingTaskAttributes") {

  def LabelingTaskAttributeId: Column[Int] = column[Int]("LabelingTaskAttributeId", O.PrimaryKey)
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId")
  def Attribute: Column[String] = column[String]("Attribute")
  // *** def Value: Column[Blob] = column[Blob]("Value")






  //  def * : ProvenShape[(Int,Int,Int)] =
  //    (GoldenLabelId,TaskImageId,LabelTypeId)
  def * = (LabelingTaskAttributeId, LabelingTaskId, Attribute /*,Value*/) <> (LabelingTaskAttribute.tupled, LabelingTaskAttribute.unapply _)
}

