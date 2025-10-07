-- Tenants/Users/RBAC
CREATE TABLE Tenants(
    id INT IDENTITY PRIMARY KEY,
    name NVARCHAR(100) NOT NULL,
    plan NVARCHAR(20) NOT NULL DEFAULT 'free',
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE Users(
    id INT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    email NVARCHAR(150) UNIQUE NOT NULL,
    password_hash VARBINARY(256) NOT NULL,
    name NVARCHAR(80),
    role NVARCHAR(20) NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Users_Tenant ON Users(tenant_id);

-- Channels（接 Telegram/LINE/FB）
CREATE TABLE Channels(
    id INT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    type NVARCHAR(20) NOT NULL,
    config_json NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'active',
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Channels_Tenant ON Channels(tenant_id);

-- Customers / Conversations / Messages
CREATE TABLE Customers(
    id BIGINT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    external_id NVARCHAR(200) NOT NULL,
    display_name NVARCHAR(120),
    last_channel_id INT NULL REFERENCES Channels(id),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE UNIQUE INDEX UX_Customer_Tenant_Ext ON Customers(tenant_id, external_id);

CREATE TABLE Conversations(
    id BIGINT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    customer_id BIGINT NOT NULL REFERENCES Customers(id),
    channel_id INT NOT NULL REFERENCES Channels(id),
    status NVARCHAR(20) NOT NULL DEFAULT 'open',
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Conversations_Tenant_Status ON Conversations(tenant_id, status);

CREATE TABLE Messages(
    id BIGINT IDENTITY PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES Conversations(id),
    direction NVARCHAR(10) NOT NULL,
    msg_type NVARCHAR(20) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    meta_json NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Messages_Conv ON Messages(conversation_id);

-- FAQs
CREATE TABLE FAQs(
    id INT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    question NVARCHAR(500) NOT NULL,
    answer NVARCHAR(MAX) NOT NULL,
    enabled BIT NOT NULL DEFAULT 1,
    tags NVARCHAR(200),
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_FAQs_Tenant ON FAQs(tenant_id);

-- Forms / Submissions（訂位/訂餐 表單）
CREATE TABLE Forms(
    id INT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    name NVARCHAR(100) NOT NULL,
    schema_json NVARCHAR(MAX) NOT NULL,
    trigger_keywords NVARCHAR(300),
    enabled BIT NOT NULL DEFAULT 1,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);

CREATE TABLE FormSubmissions(
    id BIGINT IDENTITY PRIMARY KEY,
    tenant_id INT NOT NULL REFERENCES Tenants(id),
    form_id INT NOT NULL REFERENCES Forms(id),
    conversation_id BIGINT NOT NULL REFERENCES Conversations(id),
    payload_json NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'new',
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_FormSub_Tenant ON FormSubmissions(tenant_id);

-- Jobs（排程/通知）
CREATE TABLE Jobs(
    id BIGINT IDENTITY PRIMARY KEY,
    tenant_id INT NULL,
    type NVARCHAR(50) NOT NULL,
    payload_json NVARCHAR(MAX) NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'pending',
    run_at DATETIME2 NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
CREATE INDEX IX_Jobs_StatusRunAt ON Jobs(status, run_at);
