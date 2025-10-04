using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WineStore1.Api.Data.Entities;

namespace WineStore1.Api.Data.Context;

public partial class WineStoreContext : DbContext
{
    public WineStoreContext()
    {
    }

    public WineStoreContext(DbContextOptions<WineStoreContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<StripeWebhookEvent> StripeWebhookEvents { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Wine> Wines { get; set; }

    public virtual DbSet<WineCategory> WineCategories { get; set; }

    public virtual DbSet<Winery> Wineries { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=ALEKSA\\SQLEXPRESS;Database=WINESTORE_EONIS;Trusted_Connection=True;TrustServerCertificate=True");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__465962296697C997");

            entity.ToTable("Order");

            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.BillingAddress).HasColumnName("billing_address");
            entity.Property(e => e.OrderDate)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("order_date");
            entity.Property(e => e.ShippingAddress).HasColumnName("shipping_address");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("('Pending')")
                .HasColumnName("status");
            entity.Property(e => e.TotalAmount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("total_amount");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Order__user_id__3E52440B");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.OrderItemId).HasName("PK__OrderIte__3764B6BC80EB1906");

            entity.ToTable("OrderItem", tb =>
                {
                    tb.HasTrigger("trg_OrderItem_Del_ReturnStock");
                    tb.HasTrigger("trg_OrderItem_Ins_ReserveStock");
                    tb.HasTrigger("trg_OrderItem_Upd_AdjustStock");
                });

            entity.Property(e => e.OrderItemId).HasColumnName("order_item_id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Subtotal)
                .HasComputedColumnSql("([quantity]*[unit_price])", true)
                .HasColumnType("decimal(21, 2)")
                .HasColumnName("subtotal");
            entity.Property(e => e.UnitPrice)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("unit_price");
            entity.Property(e => e.WineId).HasColumnName("wine_id");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__OrderItem__order__46E78A0C");

            entity.HasOne(d => d.Wine).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.WineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__OrderItem__wine___47DBAE45");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasKey(e => e.PaymentId).HasName("PK__Payment__ED1FC9EA1F6DD34D");

            entity.ToTable("Payment");

            entity.HasIndex(e => e.OrderId, "UQ__Payment__46596228B8F18F8C").IsUnique();

            entity.HasIndex(e => e.TransactionReference, "UQ__Payment__F0DAF2E824737707").IsUnique();

            entity.Property(e => e.PaymentId).HasColumnName("payment_id");
            entity.Property(e => e.Amount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("amount");
            entity.Property(e => e.CapturedAt).HasColumnName("captured_at");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasDefaultValueSql("('EUR')")
                .IsFixedLength()
                .HasColumnName("currency");
            entity.Property(e => e.Metadata).HasColumnName("metadata");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.PaymentDate)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("payment_date");
            entity.Property(e => e.PaymentMethod)
                .HasMaxLength(20)
                .HasColumnName("payment_method");
            entity.Property(e => e.Provider)
                .HasMaxLength(20)
                .HasDefaultValueSql("('Stripe')")
                .HasColumnName("provider");
            entity.Property(e => e.RefundedAmount)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("refunded_amount");
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValueSql("('Pending')")
                .HasColumnName("status");
            entity.Property(e => e.StripeChargeId)
                .HasMaxLength(100)
                .HasColumnName("stripe_charge_id");
            entity.Property(e => e.StripeCustomerId)
                .HasMaxLength(100)
                .HasColumnName("stripe_customer_id");
            entity.Property(e => e.StripePaymentIntentId)
                .HasMaxLength(100)
                .HasColumnName("stripe_payment_intent_id");
            entity.Property(e => e.StripePaymentMethodId)
                .HasMaxLength(100)
                .HasColumnName("stripe_payment_method_id");
            entity.Property(e => e.StripeReceiptUrl)
                .HasMaxLength(512)
                .HasColumnName("stripe_receipt_url");
            entity.Property(e => e.TransactionReference)
                .HasMaxLength(100)
                .HasColumnName("transaction_reference");

            entity.HasOne(d => d.Order).WithOne(p => p.Payment)
                .HasForeignKey<Payment>(d => d.OrderId)
                .HasConstraintName("FK__Payment__order_i__4E88ABD4");
        });

        modelBuilder.Entity<StripeWebhookEvent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__StripeWe__3213E83FFF26963B");

            entity.ToTable("StripeWebhookEvent");

            entity.HasIndex(e => e.ProviderEventId, "UQ__StripeWe__39CAAA9E12F9D088").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ErrorMessage).HasColumnName("error_message");
            entity.Property(e => e.EventType)
                .HasMaxLength(120)
                .HasColumnName("event_type");
            entity.Property(e => e.Payload).HasColumnName("payload");
            entity.Property(e => e.ProcessStatus)
                .HasMaxLength(30)
                .HasDefaultValueSql("('pending')")
                .HasColumnName("process_status");
            entity.Property(e => e.ProcessedAt).HasColumnName("processed_at");
            entity.Property(e => e.ProviderEventId)
                .HasMaxLength(200)
                .HasColumnName("provider_event_id");
            entity.Property(e => e.ReceivedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("received_at");
            entity.Property(e => e.SignatureVerified).HasColumnName("signature_verified");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__B9BE370F7235F788");

            entity.ToTable("User");

            entity.HasIndex(e => e.Email, "UQ__User__AB6E6164C09CE0B0").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Email)
                .HasMaxLength(255)
                .HasColumnName("email");
            entity.Property(e => e.FirstName)
                .HasMaxLength(80)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(80)
                .HasColumnName("last_name");
            entity.Property(e => e.PasswordHash)
                .HasMaxLength(255)
                .HasColumnName("password_hash");
            entity.Property(e => e.PhoneNumber)
                .HasMaxLength(40)
                .HasColumnName("phone_number");
            entity.Property(e => e.Role)
                .HasMaxLength(20)
                .HasDefaultValueSql("('Customer')")
                .HasColumnName("role");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
        });

        modelBuilder.Entity<Wine>(entity =>
        {
            entity.HasKey(e => e.WineId).HasName("PK__Wine__654A68CA8B2DE608");

            entity.ToTable("Wine");

            entity.Property(e => e.WineId).HasColumnName("wine_id");
            entity.Property(e => e.AlcoholPercentage)
                .HasColumnType("decimal(4, 2)")
                .HasColumnName("alcohol_percentage");
            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(255)
                .HasColumnName("image_url");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Price)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("price");
            entity.Property(e => e.StockQuantity).HasColumnName("stock_quantity");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
            entity.Property(e => e.VolumeMl)
                .HasDefaultValueSql("((750))")
                .HasColumnName("volume_ml");
            entity.Property(e => e.WineryId).HasColumnName("winery_id");
            entity.Property(e => e.Year).HasColumnName("year");

            entity.HasOne(d => d.Category).WithMany(p => p.Wines)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Wine__category_i__38996AB5");

            entity.HasOne(d => d.Winery).WithMany(p => p.Wines)
                .HasForeignKey(d => d.WineryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Wine__winery_id__398D8EEE");
        });

        modelBuilder.Entity<WineCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__WineCate__D54EE9B4FADCA658");

            entity.ToTable("WineCategory");

            entity.HasIndex(e => e.Name, "UQ__WineCate__72E12F1B1F16BC20").IsUnique();

            entity.Property(e => e.CategoryId).HasColumnName("category_id");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<Winery>(entity =>
        {
            entity.HasKey(e => e.WineryId).HasName("PK__Winery__3D10332DAE005F48");

            entity.ToTable("Winery");

            entity.Property(e => e.WineryId).HasColumnName("winery_id");
            entity.Property(e => e.Country)
                .HasMaxLength(100)
                .HasColumnName("country");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("created_at");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.FoundedYear).HasColumnName("founded_year");
            entity.Property(e => e.LogoUrl)
                .HasMaxLength(255)
                .HasColumnName("logo_url");
            entity.Property(e => e.Name)
                .HasMaxLength(200)
                .HasColumnName("name");
            entity.Property(e => e.Region)
                .HasMaxLength(100)
                .HasColumnName("region");
            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(sysdatetime())")
                .HasColumnName("updated_at");
            entity.Property(e => e.WebsiteUrl)
                .HasMaxLength(255)
                .HasColumnName("website_url");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
