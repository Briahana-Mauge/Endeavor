# SendGrid parameters
*Excerpts from:
 [https://stackoverflow.com/questions/22757908/what-parameters-are-required-to-create-an-add-to-google-calendar-link](https://stackoverflow.com/questions/22757908/what-parameters-are-required-to-create-an-add-to-google-calendar-link)*


+ **anchor address:**
http://www.google.com/calendar/event?
This is the base of the address before the parameters below.

+ **action:**
    action=TEMPLATE
    A default required parameter.

+ **src:**
    Example: src=default%40gmail.com
    Format: src=text
    This is not covered by Google help but is an optional parameter
    in order to add an event to a shared calendar rather than a user's default.

+ **text:**
    Example: text=Garden%20Waste%20Collection
    Format: text=text
    This is a required parameter giving the event title.

+ **dates:**
    Example: dates=20090621T063000Z/20090621T080000Z 
           (i.e. an event on 21 June 2009 from 7.30am to 9.0am 
            British Summer Time (=GMT+1)).
    Format: dates=YYYYMMDDToHHMMSSZ/YYYYMMDDToHHMMSSZ
           This required parameter gives the start and end dates and times
           (in Greenwich Mean Time) for the event.

+ **location:**
    Example: location=Home
    Format: location=text
    The obvious location field.

+ **trp:**
    Example: trp=false
    Format: trp=true/false
    Show event as busy (true) or available (false)

+ **sprop:**
    Example: sprop=http%3A%2F%2Fwww.me.org
    Example: sprop=name:Home%20Page
    Format: sprop=website and/or sprop=name:website_name

+ **add:**
    Example: add=default%40gmail.com
    Format:  add=guest email addresses

---

Trp stands for what RFC 5545 calls "transparency". The values described above seem backward to me, but Google does their own thing. You can also pass a URL-encoded RRULE or RDATE property with value (e.g., a URL-encoded version of RRULE:FREQ=MONTHLY;BYDAY=2SU would repeat monthly on the second Sunday) via the recur parameter to set recurring events. – Paul Rowe Dec 16 '15 at 18:41 

The dates can also be given without times - eg dates=20090621/20090621. Google Calendar will interpret this as an all-day event. – Nathan Long Jul 26 '16 at 13:33

There is an additional field details, which allows you to specify the description of the event (event body text). – Benedikt Köppel Nov 1 '16 at 8:50

&authuser=xyz@gmail.com will allow you to select the specific gmail account. Helpful if you're logged in to multiple Gmail accounts in the browser and you want to add the calendar event to a specific account. – Abdulgood89 May 17 '19 at 17:36

---
squarecandy, Nov 7 '16 at 21:34

These are the parameters that I use when I create these links. There are other parameters that exist, but I don't find them useful and they are optional. The details about how the dates work are particularly vexing and were never sufficiently documented by google.

+ action=TEMPLATE (required)
+ text (url encoded name of the event)
+ dates (ISO date format, startdate/enddate - must have both start and end time or it won't work. The start and end date can be the same if appropriate.)
  - to use the user's timezone: 20161208T160000/20161208T180000
  - to use global time, convert to UTC, then use 20131208T160000Z/20131208T180000Z
  - all day events, you can use 20161208/20161209 - note that the old google documentation gets it wrong. You must use the following date as the end date for a one day all day event, or +1 day to whatever you want the end date to be.
+ details (url encoded event description/details)
+ location (url encoded location of the event - make sure it's an address google maps can read easily)
