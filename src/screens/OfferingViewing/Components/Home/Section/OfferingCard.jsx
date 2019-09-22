import React from 'react'
import { Link } from 'react-router-dom'
// UI
import { Card } from 'react-bootstrap'
import { StarredButton } from './Overlays'
import './index.css'
// Vars
import { handleData, search, util, user } from 'utils'
const imgHolder = require('images/Video-Placeholder.jpg')

export default function OfferingCard({ offering, depart, termSelected, image=false, fullCourse=null }) {
  // if the full offering data has not yet loaded
  if (image && (!offering.courses || offering.isTestCourse)) return null
  if (image && termSelected.length && !handleData.includes(termSelected, offering.offering.termId)) return null;
  // if loaded set the fullCourse
  const course = fullCourse ? null : handleData.find(offering.courses, { departmentId: depart.id })
  if (course) {
    fullCourse = {
      ...course, 
      key: offering.id || offering.offering.id,
      id: offering.id || offering.offering.id,
      courseNumber: depart.acronym + course.courseNumber,
      fullNumber: search.getFullNumber(offering.courses),
      termName: offering.offering.termName,
      section: offering.offering.sectionName,
      accessType: offering.offering.accessType,
    }
  }

  const isLoggedIn = user.isLoggedIn()

  return !fullCourse ? null :
    <div className="offering-card-container">
      {
        (isLoggedIn && image)
        && 
        <StarredButton 
          position={image ? 'middle' : 'top'}
          fullCourse={fullCourse} 
        />
      }
      <Card 
        className={`offeringCard ${image ? 'image-card' : 'basic-card'}`} as={Link} 
        to={{
          pathname: util.links.offeringDetail(fullCourse.id),
          state: { hash: fullCourse.acronym, from: 'home', fullCourse: fullCourse }
        }}
        title={`${fullCourse.courseNumber} ${fullCourse.courseName}`}
        aria-describedby={"offering-info-" + fullCourse.id}
      >
        {
          image
          &&
          <Card.Img 
            className="img" variant="top" 
            src={imgHolder} style={{pointerEvents: 'none'}}
            alt=""
          />
        }
        <p id={"offering-info-" + fullCourse.id} className="accessbility_hide">{fullCourse.courseNumber + ' ' + fullCourse.courseName + ' ' + fullCourse.termName + ' ' + fullCourse.section}</p>
        <Card.Body>
          <Card.Title className="title">
            <strong>{fullCourse.courseNumber} </strong> <br/>{fullCourse.courseName}
          </Card.Title>
          <Card.Text className="info">
            {fullCourse.termName} - {fullCourse.section}
          </Card.Text>
          <Card.Text className="description">
            {fullCourse.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
}