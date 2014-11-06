import org.scalatest._

import scala.slick.driver.H2Driver.simple._
// import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._


class SidewalkTable_Spec extends FunSuite with BeforeAndAfter {
  val assignments = TableQuery[Assignments]
  val labelingTasks = TableQuery[LabelingTasks]

  implicit var session: Session = _

  // Create table
  // Data Definition Language (DDL): http://slick.typesafe.com/doc/2.0.3/schemas.html#data-definition-language
  def createSchema() = (assignments.ddl ++ labelingTasks.ddl).create // Todo: Akash

  def insertAssignment(): Int = assignments += (1,"TestTurkerId","TestHit","TestAssignment","StreetViewLabeler","3", 1,	0,"PilotTask","2013-06-21 18:03:28")


  before {
    session = Database.forURL("jdbc:h2:mem:test1", driver = "org.h2.Driver").createSession()
    //session = Database.forURL("jdbc:mysql://localhost:3306/sidewalk-test", driver="com.mysql.jdbc.Driver", user="root", password="").createSession()
  }

  test("Creating the Schema works") {
    createSchema()

    val tables = MTable.getTables.list

    assert(tables.size == 2)
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
      assignments += (1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	"2013-06-21 18:03:28")
      assignments += (2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	"2013-06-28 14:19:17")
      assignments += (3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	"2013-07-03 12:24:36")

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
      labelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      labelingTasks += (3,	2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      labelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

      val results = labelingTasks.list
      assert(results.size == 3)
      assert(results.head._1 == 2)
    }
  }

  test("Inserting LabelingTasks works") {
    session.withTransaction {
      assignments += (1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	"2013-06-21 18:03:28")
      assignments += (2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	"2013-06-28 14:19:17")
      assignments += (3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	"2013-07-03 12:24:36")

      labelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      labelingTasks += (3, 2, 3,	"3dlyB8Z0jFmZKSsTQJjMQg",	0, "undefined", 0, "undefined")
      labelingTasks += (4, 2, 4, "_AUz5cV_ofocoDbesxY3Kw", 0, "undefined",	0, "undefined")

      // Slick inner join
      // http://slick.typesafe.com/doc/2.1.0/queries.html
      val joined = for {
        (a, l) <- assignments innerJoin labelingTasks on (_.AssignmentId === _.AssignmentId)
      } yield (a.AssignmentId, a.AmazonTurkerId, l.LabelingTaskId)

      val results = joined.list

      assert(results.size == 2)

      // Ones that will remain with inner join should be the ones with AssignmentId == 2.
      assert(results.head._1 == 2)

      // The TurkerId should be "Test_Kotaro"
      assert(results.head._2 == "Test_Kotaro")

      // The Google Street View id should be '3dlyB8Z0jFmZKSsTQJjMQg'
      assert(results.head._3 == "3dlyB8Z0jFmZKSsTQJjMQg")

    }
  }


  after {
    session.close()
  }
}