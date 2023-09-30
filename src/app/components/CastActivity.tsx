import sql from '../db.js'
import style from '../css/CastActivity.module.css'

export default async function HomeFeed(fid: any) {

  // width: 600px;
  //   260 = Sunday
  //   260 = Monday
  //   261 = Tuesday
  //   262 = Wednesday
  //   263 = Thursday
  //   264 = Friday
  //   265 = Saturday

  // width: 375px;
  //   168 = Sunday
  //   169 = Monday
  //   170 = Tuesday
  //   171 = Wednesday
  //   172 = Thursday
  //   173 = Friday
  //   174 = Saturday

  let getDay = new Date().getDay()
  var day = 0
  switch (getDay) {
    case 0: // Sunday
      var day = 168
      break;
    case 1: // Monday
      var day = 169
      break;
    case 2: // Tuesday
      var day = 170
      break;
    case 3: // Wednesday
      var day = 171
      break;
    case 4: // Thursday
      var day = 172
      break;
    case 5: // Friday
      var day = 173
      break;
    case 6: // Saturday
      var day = 174
      break;
    default:
      var day = 171 // Wednesday default
  }
  
  const getData = async function(){
    const data = await sql`
      WITH date_range AS (
        SELECT NOW() - (n || ' days')::interval AS date
        FROM generate_series(0, ${day}) AS n
      )
      SELECT DATE(date_range.date) AS date,
            COUNT(casts.timestamp) AS castamount
      FROM date_range
      LEFT JOIN casts
      ON DATE(date_range.date) = DATE(casts.timestamp)
      AND casts.fid = ${fid.fid}
      GROUP BY DATE(date_range.date)
      ORDER BY DATE(date_range.date);
      `
    return data
  }

  const data = await getData()

  // for(let i=0; i<data.length; i++){
  //   'https://api.neynar.com/v2/farcaster/cast?type=url&identifier=https%3A%2F%2Fwarpcast.com%2Frish%2F0x9288c1' \
  //   'api_key: NEYNAR_API_DOCS'
  // }


  return (
    <>
      <div className={style['cast-activity-wrapper']}>
        <div className={style['cast-activity']}>
          {data.length != 0 ? data.map((event: any) => (
            <a className={ parseInt(event.castamount) == 0 ? style['cast-color-0'] : (parseInt(event.castamount) <= 4 ? style['cast-color-2'] : parseInt(event.castamount) <= 8 ? style['cast-color-4'] : parseInt(event.castamount) <= 12 ? style['cast-color-6'] : style['cast-color-8']) }></a>
          )) : <a>Nothing here...</a>
          }
        </div>
      </div>
    </>
    )
}