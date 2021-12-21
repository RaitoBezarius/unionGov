{ config, pkgs, ... }:
{
  deployment.targetEnv = "proxmox";
  deployment.proxmox = {
    profile = "default";
    node = "askeladd";
    pool = "uniongov";
    uefi = {
      enable = true;
      volume = "sata-vmdata";
    };
    network = [
      ({ bridge = "vmbr2"; tag = 400; })
      ({ bridge = "vmbr2"; tag = 300; })
    ];
    installISO = "local:iso/Raito-NixOS.iso";
    disks = [
      ({
        volume = "sata-vmdata";
        size = "20G";
      })
    ];
    memory = 2048;
    partitions = let
      mkSubvolume = mp: name: "btrfs subvolume create ${mp}/${name}";
    in
    ''
      set -x
      set -e
      wipefs -f /dev/sda
      parted --script /dev/sda -- mklabel gpt
      parted --script /dev/sda -- mkpart primary fat32 1MiB 1024MiB
      parted --script /dev/sda -- mkpart primary linux-swap 1024MiB 3GiB
      parted --script /dev/sda -- mkpart primary btrfs 3GiB 100%
      parted --script /dev/sda -- set 1 boot on
      sleep 0.5
      mkfs.vfat /dev/sda1 -n NIXBOOT
      mkswap /dev/sda2 -L nixswap && swapon /dev/sda2
      mkfs.btrfs /dev/sda3 -f -L nixroot
      MOUNTDIR=$(mktemp -d)
      mount -t btrfs -o defaults,ssd,compress=zstd /dev/sda3 $MOUNTDIR
      ${mkSubvolume "$MOUNTDIR" "root"}
      umount -R $MOUNTDIR
      mount -t btrfs -o defaults,ssd,compress=zstd,subvol=root /dev/sda3 /mnt
      mkdir -p /mnt/boot
      mount /dev/sda1 /mnt/boot
      ${mkSubvolume "/mnt" "nix"}
      ${mkSubvolume "/mnt" "home"}
      ${mkSubvolume "/mnt" "var"}
      ${mkSubvolume "/mnt" "etc"}
    '';
  };

  fileSystems = {
    "/" = {
      device = "/dev/sda3";
      fsType = "btrfs";
      options = [ "subvol=root" "compress=zstd" "space_cache" "noatime" ];
    };
    "/boot" = {
      device = "/dev/sda1";
      fsType = "vfat";
    };
  };
  swapDevices = [
    { device = "/dev/sda2"; }
  ];

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
}
