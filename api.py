import json
import config
from flask import request
from easydb import EasyDB

def dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def api_action(action):
    db = EasyDB(config.DATABASE_URI)
    db.connection.row_factory = dict_factory

    if request.method == 'POST':
        try:
            data = json.loads(request.data)
        except:
            return api_output('fail', message='Can\'t parse json.')

        if action == 'add':
            return api_add(db, data)

    if request.method == 'GET':
        if action == 'get_summary':
            return api_get_summary(db)
        elif action == 'get_summary_by_12hours':
            return api_get_summary_by_12hours(db)



    return api_output('fail', message='Do nothing.')

def api_output(status, content='', message=''):
    return json.dumps({'status':status, 'message':message, 'content':content})

def api_add(db, data):
    checking_keys = ["device_id","temperature","pressure","humidity","battery_voltage"]
    for key in checking_keys:
        if data[key] == '':
            return api_output('fail', message="Empty field: " + key)

    try:
        db.query("""
            INSERT INTO sensor(device_id,temperature,pressure,humidity,battery_voltage,created_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'))""",
            (int(data['device_id']), float(data['temperature']), int(data['pressure']), float(data['humidity']), float(data['battery_voltage']))
        )
    except:
        return api_output('fail', message='Sql error.')

    return api_output('ok', message='Data saved.')

def api_get_summary(db):
    content = db.query("SELECT device_id,temperature,pressure,humidity,battery_voltage,created_at "
                       "FROM sensor "
                       "ORDER BY created_at DESC LIMIT 1")
    return api_output('ok', content=json.dumps(content.fetchone()))

def api_get_summary_by_12hours(db):
    content = db.query("SELECT device_id,temperature,pressure,humidity,battery_voltage,created_at, substr(created_at, 0, 14) as sub_created_at "
                       "FROM sensor "
                       "WHERE created_at > datetime('now', '-12 hours') "
                       "GROUP BY sub_created_at "
                       "ORDER BY created_at ASC "
                       "LIMIT 12")
    return api_output('ok', content=json.dumps(content.fetchall()))

