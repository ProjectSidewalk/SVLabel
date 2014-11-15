import org.scalatest._

import scala.slick.driver.H2Driver.simple._
// import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._

// Tests updated by Akash Magoon 11/8/2014
class SidewalkTable_Spec extends FunSuite with BeforeAndAfter {
  val assignments = TableQuery[Assignments]
  val LabelingTasks = TableQuery[LabelingTasks]
  val binnedLabels = TableQuery[binnedLabels]
  implicit var session: Session = _

  // Create table
  // Data Definition Language (DDL): http://slick.typesafe.com/doc/2.0.3/schemas.html#data-definition-language
  def createSchema() = (assignments.ddl ++ LabelingTasks.ddl ++ binnedLabels.ddl).create // Todo: Akash

  def insertAssignment(): Int = assignments += (1,"TestTurkerId","TestHit","TestAssignment","StreetViewLabeler","3", 1,	0,"PilotTask","2013-06-21 18:03:28")
  def insertLabelingTasks(): Int = LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg", 0, "undefined", 0, "NULL")
  def insertBinnedLabels(): Int = binnedLabels += (1,1,3291)
  before {
    session = Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver").createSession()
    //session = Database.forURL("jdbc:mysql://localhost:3306/sidewalk-test", driver="com.mysql.jdbc.Driver", user="root", password="").createSession()
  }

  test("Creating the Schema works") {
    createSchema()

    val tables = MTable.getTables.list

    assert(tables.size == 3)
    assert(tables.count(_.name.name.equalsIgnoreCase("assignments")) == 1)
  }


  test("Inserting an Assignment works") {
    session.withTransaction {
      createSchema()

      val insertCount = insertAssignment()
      assert(insertCount == 1)

      session.rollback()
    }

    session.withTransaction {

      assignments +=(1, "TestTurkerId", "TestHit", "TestAssignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", "2013-06-21 18:03:28")
      assignments +=(2, "Test_Kotaro", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", "2013-06-28 14:19:17")
      assignments +=(3, "Researcher_Jonah", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "ResearcherTask", "2013-07-03 12:24:36")

      val results = assignments.list
      assert(results.size == 3)

      val items = assignments.filter(_.AssignmentId === 1).list

      assert(items.head._2 == "TestTurkerId")
      session.rollback()
    }
  }


  test("Query Assignments works") {
    session.withTransaction {
      createSchema()
      insertAssignment()
      val results = assignments.list
      assert(results.size == 1)
      assert(results.head._1 == 1)

      session.rollback()
    }
  }

  // Todo: Akash
  test("Inserting LabelingTasks works") {
    session.withTransaction {
      createSchema()

      val insertCount = insertLabelingTasks()
      assert(insertCount == 1)

      session.rollback()
    }
    session.withTransaction {
      LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (3,	2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

      val results = LabelingTasks.list
      assert(results.size == 3)
      assert(results.head._1 == 2)
    }
  }

  // Inner join test, joining assignments and LabelingTasks where AssignmentIds for both are equal
  test("Inner join test: assignments and LabelingTasks") {

    session.withTransaction {

      createSchema()

      assignments += (1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	"2013-06-21 18:03:28")
      assignments += (2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	"2013-06-28 14:19:17")
      assignments += (3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	"2013-07-03 12:24:36")

      LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (3, 2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      LabelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

     //Slick inner join
     //http://slick.typesafe.com/doc/2.1.0/queries.html
     /*val joined = for {
        (a, l) <- assignments innerJoin LabelingTasks on (_.AssignmentId === _.AssignmentId)
      } yield (a.AssignmentId, a.AmazonTurkerId, l.LabelingTaskId)*/

      val innerjoin = for {
        a <- assignments
        l <- LabelingTasks if a.AssignmentId === l.AssignmentId
      } yield(a.AssignmentId, a.AmazonTurkerId, l.LabelingTaskId)

      val results = innerjoin.list

      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == "TestTurkerId")

  }}

  // Test by Akash Magoon 11/15/2014
  test("Query binnedLabels works") {
    session.withTransaction {
      createSchema()
      insertBinnedLabels()
      val results = binnedLabels.list
      assert(results.size == 1)
      assert(results.head._1 == 1)
      session.rollback()
    }
  }
  test("Inserting binnedLabels works") {
    createSchema()
      binnedLabels += (1,1,3291)
      binnedLabels += (2,1,3292)
      binnedLabels += (3,1,3293)

      val results = binnedLabels.list
      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == 1)
      assert(results.head._3 == 3291)

    }
  test("Inner join test: assignments, LabelingTasks, binned labels") {

    session.withTransaction {

      createSchema()

      assignments += (1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	"2013-06-21 18:03:28")
      assignments += (2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	"2013-06-28 14:19:17")
      assignments += (3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	"2013-07-03 12:24:36")

      binnedLabels += (1,1,3291)
      binnedLabels += (2,1,3292)
      binnedLabels += (3,1,3293)

        val innerjoin = for {
        a <- assignments
        b <- binnedLabels
        if a.AssignmentId === b.BinnedLabelId
      } yield(a.AssignmentId, a.AmazonTurkerId, b.LabelId, b.LabelBinId)

      val results = innerjoin.list

      assert(results.size == 3)
      assert(results.head._1 == 1)
      assert(results.head._2 == "TestTurkerId")

    }}
after {
    session.close()
  }
}