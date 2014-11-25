/**
 * Created by Akash on 11/25/2014.
 */

import java.sql.Timestamp

import scala.slick.driver.H2Driver.simple._
import scala.slick.lifted.ProvenShape

case class LabelingTaskEnvironment(LabelingTaskEnvironmentId: Int,LabelingTaskId: Int,Browser: String, BrowserVersion:String,
                                   BrowserWidth: String, BrowserHeight: String,AvailWidth: String, AvailHeight: String, ScreenWidth: String,
                                   ScreenHeight: String, OperatingSystem: String,DatetimeInserted: String )

class LabelingTaskEnvironments(tag: Tag)
  extends Table[LabelingTaskEnvironment](tag, "LabelingTaskEnvironment") {

  def LabelingTaskEnvironmentId: Column[Int] = column[Int]("LabelingTaskEnvironmentId", O.PrimaryKey)
  def LabelingTaskId: Column[Int] = column[Int]("LabelingTaskId")
  def Browser: Column[String] = column[String]("Browser")
  def BrowserVersion: Column[String] = column[String]("BrowserVersion")
  def BrowserWidth: Column[String] = column[String]("BrowserWidth")
  def BrowserHeight: Column[String] = column[String]("BrowserHeight")
  def AvailWidth: Column[String] = column[String]("AvailWidth")
  def AvailHeight: Column[String] = column[String]("AvailHeight")
  def ScreenWidth: Column[String] = column[String]("ScreenWidth")
  def ScreenHeight: Column[String] = column[String]("ScreenHeight")
  def OperatingSystem: Column[String] = column[String]("OperatingSystem")
  def DatetimeInserted: Column[String] = column[String]("DatetimeInserted")








  def * = (LabelingTaskEnvironmentId,LabelingTaskId,Browser, BrowserVersion,BrowserWidth, BrowserHeight,AvailWidth, AvailHeight, ScreenWidth, ScreenHeight, OperatingSystem,DatetimeInserted) <> (LabelingTaskEnvironment.tupled, LabelingTaskEnvironment.unapply _)
}
