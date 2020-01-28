const   dav = require('dav'),
        ics = require('ics')

const event = {
    start: [2020, 1, 28, 6, 30],
    end: [2020, 1, 28, 16, 30],
    title: 'Test event',
    description: 'This is a test event',
    location: 'Oxford Street, London',
    status: 'CONFIRMED',
    busyStatus: 'BUSY'
}

async function main() {
    let icsObject = await new Promise((resolve, reject) => {
            ics.createEvent(event, (error, value) => {
            if (error) {
            reject(error)
            }
            resolve(value)
        })
    })

    console.log("icsObject", icsObject)
            
    var xhr = new dav.transport.Basic(
        new dav.Credentials({
        username: 'xxx@xxx.com', //apple ID email address
        password: 'xxx-xxx-xxx' //app specific password generated on https://appleid.apple.com/account/manage
        })
    );

    let calendarData = {
        url: null,
        ref: null
    }

    dav.createAccount({ server: 'https://caldav.icloud.com/', xhr: xhr }).then(function(account) {
        for(let calendar of account.calendars) {
            if(calendar.data.props.supportedCalendarComponentSet.indexOf('VEVENT') > -1) {
                calendarData.url = calendar.url
                calendarData.ref = calendar
                break
            }
        }

        dav.createCalendarObject(calendarData.ref, {
            data: icsObject,
            filename: 'test.ics',
            xhr: xhr
        }).then(function(result) {
            console.log("event creation result", result)
        }).catch((reason) => {
            console.log('1. Handle rejected promise ('+reason+') here.');
        })
    }).catch((reason) => {
        console.log('2. Handle rejected promise ('+reason+') here.');
    })
}

main()
