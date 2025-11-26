"""backend.models.enums

Shared TextChoices and small enumerations used by models and business
logic, e.g. user roles, item statuses and box statuses.
"""

from django.db import models

class UserRole(models.TextChoices):
    SUPER_ADMIN = 'super_admin', 'Super Admin'
    ADMIN = 'admin', 'Admin'
    EMPLOYEE = 'employee', 'Employee'
    CUSTOMER = 'customer', 'Customer'

class ItemStatus(models.TextChoices):
    AWAITING_ARRIVAL = 'awaiting_arrival', 'Awaiting Arrival'
    ARRIVED_WAREHOUSE = 'arrived_warehouse', 'Arrived at Warehouse'
    VALIDATED = 'validated', 'Validated'
    IN_BOX = 'in_box', 'In Box'
    SHIPPED = 'shipped', 'Shipped'
    IN_TRANSIT = 'in_transit', 'In Transit'
    ARRIVED_DESTINATION_WAREHOUSE = 'arrived_destination_warehouse', 'Arrived at Destination Warehouse'
    AT_CUSTOMS = 'at_customs', 'At Customs'
    RELEASED_CUSTOMS = 'released_customs', 'Released from Customs'
    OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
    DELIVERED = 'delivered', 'Delivered'
    RETURNED = 'returned', 'Returned'
    REFUNDED = 'refunded', 'Refunded'
    MISMATCHED = 'mismatched', 'Mismatched'

class BoxStatus(models.TextChoices):
    BUILDING = 'building', 'Building'
    READY_TO_SHIP = 'ready_to_ship', 'Ready to Ship'
    SHIPPED = 'shipped', 'Shipped'
    IN_TRANSIT = 'in_transit', 'In Transit'
    ARRIVED = 'arrived', 'Arrived'
    AT_CUSTOMS = 'at_customs', 'At Customs'
    RELEASED_CUSTOMS = 'released_customs', 'Released from Customs'
    OUT_FOR_DELIVERY = 'out_for_delivery', 'Out for Delivery'
    DELIVERED = 'delivered', 'Delivered'
    RETURNED = 'returned', 'Returned'
    REFUNDED = 'refunded', 'Refunded'

class SourceOrderStatus(models.TextChoices):
    PLACED = 'placed', 'Placed'
    SHIPPED_TO_WAREHOUSE = 'shipped_to_warehouse', 'Shipped to Warehouse'
    ARRIVED_WAREHOUSE = 'arrived_warehouse', 'Arrived at Warehouse'
    CANCELLED = 'cancelled', 'Cancelled'
    REFUNDED = 'refunded', 'Refunded'

class RequestStatus(models.TextChoices):
    OPEN = 'open', 'Open'
    IN_PROGRESS = 'in_progress', 'In Progress'
    RESOLVED = 'resolved', 'Resolved'
    CLOSED = 'closed', 'Closed'

class EntityType(models.TextChoices):
    ITEM = 'item', 'Item'
    BOX = 'box', 'Box'
    SHIPMENT_DESTINATION = 'shipment_destination', 'Shipment Destination'