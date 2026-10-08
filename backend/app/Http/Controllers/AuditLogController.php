<?php

namespace App\Http\Controllers;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    public function index(Request $request)
    {
        $logs = AuditLog::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    public function show(Request $request, $id)
    {
        $log = AuditLog::where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($log);
    }

    public function getByAction(Request $request, $action)
    {
        $logs = AuditLog::where('user_id', $request->user()->id)
            ->where('event', $action)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }

    public function getByModel(Request $request, $modelType, $modelId)
    {
        $logs = AuditLog::where('user_id', $request->user()->id)
            ->where('auditable_type', $modelType)
            ->where('auditable_id', $modelId)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($logs);
    }
}