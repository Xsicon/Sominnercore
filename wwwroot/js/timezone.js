window.kobnetiTimeZone = {
  getInfo: function () {
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    var now = new Date();
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short'
    }).formatToParts(now);
    var abbr = (parts.find(function (p) { return p.type === 'timeZoneName'; }) || {}).value || tz;
    var offsetMin = -now.getTimezoneOffset();
    var sign = offsetMin >= 0 ? '+' : '-';
    var abs = Math.abs(offsetMin);
    var h = String(Math.floor(abs / 60));
    var m = String(abs % 60).padStart(2, '0');
    var nowTime = new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit'
    }).format(now);
    return {
      id: tz,
      abbreviation: abbr,
      offsetLabel: 'UTC' + sign + h + (m === '00' ? '' : ':' + m),
      offsetMinutes: offsetMin,
      nowTime: nowTime
    };
  },

  formatTimeWithZone: function (isoUtc, timeZoneId) {
    if (!isoUtc) return '—';
    var d = new Date(isoUtc);
    if (isNaN(d.getTime())) return '—';
    var tz = timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;
    var time = new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit'
    }).format(d);
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short'
    }).formatToParts(d);
    var abbr = (parts.find(function (p) { return p.type === 'timeZoneName'; }) || {}).value || tz;
    return time + ' ' + abbr;
  },

  formatUtc: function (isoUtc, timeZoneId, kind) {
    if (!isoUtc) return '—';
    var d = new Date(isoUtc);
    if (isNaN(d.getTime())) return '—';
    var tz = timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (kind === 'time') {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        hour: 'numeric',
        minute: '2-digit'
      }).format(d);
    }
    if (kind === 'date') {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(d);
    }
    if (kind === 'datekey') {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(d);
    }
    if (kind === 'datetime') {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: tz,
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      }).format(d);
    }
    return new Intl.DateTimeFormat(undefined, {
      timeZone: tz,
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(d);
  },

  abbreviationFor: function (timeZoneId) {
    var tz = timeZoneId || Intl.DateTimeFormat().resolvedOptions().timeZone;
    var parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      timeZoneName: 'short'
    }).formatToParts(new Date());
    return (parts.find(function (p) { return p.type === 'timeZoneName'; }) || {}).value || tz;
  }
};
