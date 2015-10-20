var unknown = 'Unknown';

function getValue(crash, key) {
    if (!(key in crash)) {
        return unknown;
    }
    if (crash[key] === '') {
        return unknown;
    }
    return crash[key];
}

function sanitizeAge(age) { return age > 0 ? age : unknown; }
function sanitizeAlcohol(alc) { return alc === "Yes" || alc === "No" ? alc : unknown; }
function sanitizeInjury(injury) {
    injury = injury.trim();
    if (injury.indexOf(':') == 1) {
        return injury.substring(3);
    } else if (injury == "Injury") {
        return "Other Injury";
    } else {
        return unknown;
    }
}
var races = ['Black', 'White', 'Asian', 'Hispanic', 'Other', 'Native American'];
function sanitizeRace(race) {
    if (races.indexOf(races) >= 0) {
        return race;
    } else {
        return unknown;
    }
}

function sanitizeCrashType(type) {
    return type.replace(/^(\s+|\s+|\/|-)*/g,'').replace(/(\s+|\s+|\/|-)*$/g,'');
}

function getPerson(type, crash) {
    return {
        age: sanitizeAge(getValue(crash, type + '_age')),
        alcohol: sanitizeAlcohol(getValue(crash, type + '_alc_d')),
        injury: sanitizeInjury(getValue(crash, type + '_injur')),
        race: sanitizeRace(getValue(crash, type + '_race')),
        sex: getValue(crash, type + '_sex')
    };
}

function getBiker(crash) {
    var biker = getPerson('bike', crash);

    biker.direction = getValue(crash, 'bike_dir');
    biker.position = getValue(crash, 'bike_pos');


    return biker;
}

function getDriver(crash) {
    var driver = getPerson('drvr', crash);

    driver.vehicle_type = getValue(crash, 'drvr_vehty');
    driver.estimated_speed = getValue(crash, 'drvr_estsp');

    return driver;
}

function getLocation(crash) {
    return {
        city: getValue(crash, 'city'),
        county: getValue(crash, 'county'),
        region: getValue(crash, 'region'),
        development: getValue(crash, 'developmen'),
        latitude: getValue(crash, 'latitude'),
        longitude: getValue(crash, 'longitude'),
        locality: getValue(crash, 'locality'),
        lanes: getValue(crash, 'num_lanes'),
        characteristics: getValue(crash, 'rd_charact'),
        class: getValue(crash, 'rd_class'),
        configuration: getValue(crash, 'rd_config'),
        feature: getValue(crash, 'rd_feature'),
        surface: getValue(crash, 'rd_surface'),
        rural_urban: getValue(crash, 'rural_urba'),
        speed_limit: getValue(crash, 'speed_limi'),
        traffic_control: getValue(crash, 'traff_cntr')
    };
}

function getCrashDetails(crash) {
    return {
        ambulance: getValue(crash, 'ambulancer'),
        group: getValue(crash, 'crash_grp'),
        location: getValue(crash, 'crash_loc'),
        type: sanitizeCrashType(getValue(crash, 'crash_type')),
        hit_and_run: getValue(crash, 'hit_run'),
        timestamp: crash.crash_date.split('T')[0] + 'T' + crash.crash_time + ':00',
        light_conditions: getValue(crash, 'light_cond'),
        road_conditions: getValue(crash, 'rd_conditi'),
        road_defects: getValue(crash, 'rd_defects'),
        weather: getValue(crash, 'weather'),
        workzone: getValue(crash, 'workzone_i')
    };
}

function createNewCrash(oldCrash) {
    return {
        biker: getBiker(oldCrash),
        driver: getDriver(oldCrash),
        location: getLocation(oldCrash),
        crash: getCrashDetails(oldCrash),
    };
}

module.exports = createNewCrash;
