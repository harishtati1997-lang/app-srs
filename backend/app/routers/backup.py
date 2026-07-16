import os
import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from .. import models, deps

router = APIRouter(
    prefix="/api/backup",
    tags=["backup"]
)

def model_to_dict(obj):
    """Helper to convert an SQLAlchemy model instance into a serializable dictionary."""
    data = {}
    for column in obj.__table__.columns:
        value = getattr(obj, column.name)
        if isinstance(value, (datetime, datetime.date if hasattr(datetime, 'date') else type(None))):
            if value is not None:
                value = value.isoformat()
        data[column.name] = value
    return data

@router.get("/export-json")
def export_universal_backup(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Exports the entire database (works with both Supabase PostgreSQL and local SQLite)
    into a structured, universal JSON backup file.
    """
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can export database backups.")

    backup_data = {
        "metadata": {
            "backup_timestamp": datetime.utcnow().isoformat(),
            "generated_by": current_user.username,
            "version": "1.0",
            "system": "SYAM INFRA CMS"
        },
        "tables": {
            "users": [model_to_dict(u) for u in db.query(models.User).all()],
            "projects": [model_to_dict(p) for p in db.query(models.Project).all()],
            "payment_schedules": [model_to_dict(s) for s in db.query(models.PaymentSchedule).all()],
            "payment_history": [model_to_dict(h) for h in db.query(models.PaymentHistory).all()],
            "expenses": [model_to_dict(e) for e in db.query(models.Expense).all()],
            "documents": [model_to_dict(d) for d in db.query(models.Document).all()],
            "project_progress": [model_to_dict(pr) for pr in db.query(models.ProjectProgress).all()],
            "invoices": [model_to_dict(i) for i in db.query(models.Invoice).all()],
            "project_materials": [model_to_dict(m) for m in db.query(models.ProjectMaterial).all()],
        }
    }

    json_str = json.dumps(backup_data, indent=2)
    filename = f"SYAM_INFRA_Universal_Backup_{datetime.now().strftime('%Y-%m-%d_%H%M%S')}.json"

    return Response(
        content=json_str,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@router.get("/export-sqlite")
def export_sqlite_file(
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    If running locally with SQLite, directly downloads the syam_infra.db file.
    If on Supabase PostgreSQL, informs the user to use JSON export instead.
    """
    if current_user.role != "Admin":
        raise HTTPException(status_code=403, detail="Only Admins can export database backups.")

    db_path = "./syam_infra.db"
    if os.path.exists(db_path):
        filename = f"syam_infra_{datetime.now().strftime('%Y-%m-%d_%H%M%S')}.db"
        return FileResponse(
            path=db_path,
            filename=filename,
            media_type="application/x-sqlite3"
        )
    else:
        raise HTTPException(
            status_code=400,
            detail="Your server is currently running on PostgreSQL (Supabase). Please use the Universal JSON Backup option."
        )
