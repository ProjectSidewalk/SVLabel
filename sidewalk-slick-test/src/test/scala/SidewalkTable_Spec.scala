import org.scalatest._
import scala.slick.driver.H2Driver.simple._
// import scala.slick.driver.MySQLDriver.simple._
import scala.slick.jdbc.meta._
import java.sql.Timestamp
import org.joda.time.DateTime
import org.joda.time.format.{DateTimeFormatter, DateTimeFormat}

// Tests updated by Akash Magoon 11/8/2014
class SidewalkTable_Spec extends FunSuite with BeforeAndAfter {
  val assignments = TableQuery[Assignments]
  val LabelingTasks = TableQuery[LabelingTasks]

  implicit var session: Session = _

  // String to Timestamp (joda time)
  // http://stackoverflow.com/questions/6252678/converting-a-date-string-to-a-datetime-object-using-joda-time-library
  // http://stackoverflow.com/questions/5272312/joda-time-library-in-scala-returning-incorrect-date
  val dtf:DateTimeFormatter = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss"); // "2013-06-21 18:03:28"

  // Create table
  // Data Definition Language (DDL): http://slick.typesafe.com/doc/2.0.3/schemas.html#data-definition-language
  def createSchema() = (assignments.ddl ++ LabelingTasks.ddl).create // Todo: Akash

  def insertAssignment(): Int = assignments += Assignment(1,"TestTurkerId","TestHit","TestAssignment","StreetViewLabeler","3", 1,	0,"PilotTask", dtf.parseDateTime("2013-06-21 18:03:28"))
  def insertLabelingTasks(): Int = LabelingTasks += (2, 1, 3, "3dlyB8Z0jFmZKSsTQJjMQg", 0, "undefined", 0, "NULL")
  before {
    session = Database.forURL("jdbc:h2:mem:sidewalktable", driver = "org.h2.Driver").createSession()
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
      // DateTime dt = formatter.parseDateTime(string);

      assignments += Assignment(1, "TestTurkerId", "TestHit", "TestAssignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2, "Test_Kotaro", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "PilotTask", dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3, "Researcher_Jonah", "Test_Hit", "Test_Assignment", "StreetViewLabeler", "3", 1, 0, "ResearcherTask", dtf.parseDateTime("2013-07-03 12:24:36"))

      val results = assignments.list
      assert(results.size == 3)

      val items = assignments.filter(_.AssignmentId === 1).list

      assert(items.head.AmazonTurkerId == "TestTurkerId")
      session.rollback()
    }
  }


  test("Query Assignments works") {
    session.withTransaction {
      createSchema()
      insertAssignment()
      val results = assignments.list
      assert(results.size == 1)
      assert(results.head.AssignmentId == 1)

      session.rollback()
    }
  }

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

      assignments += Assignment(1,	"TestTurkerId",	"TestHit",	"TestAssignment",	"StreetViewLabeler",	"3", 1,	0, "PilotTask",	dtf.parseDateTime("2013-06-21 18:03:28"))
      assignments += Assignment(2,	"Test_Kotaro",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"PilotTask",	dtf.parseDateTime("2013-06-28 14:19:17"))
      assignments += Assignment(3,	"Researcher_Jonah",	"Test_Hit",	"Test_Assignment",	"StreetViewLabeler",	"3",	1,	0,	"ResearcherTask",	dtf.parseDateTime("2013-07-03 12:24:36"))

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


  after {
    session.close()
  }
}